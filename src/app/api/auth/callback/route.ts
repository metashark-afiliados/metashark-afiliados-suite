// src/app/api/auth/callback/route.ts
/**
 * @file src/app/api/auth/callback/route.ts
 * @description Route Handler para el callback de autenticación. Refactorizado
 *              para alinear el logging con la firma canónica, resolviendo
 *              el error de tipo TS2345.
 * @author L.I.A. Legacy
 * @version 6.0.0
 */
import { type User } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

const isValidRedirect = (path: string): boolean => {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes(":");
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForProfile(user: User): Promise<Tables<"profiles"> | null> {
  const supabase = createClient();
  let attempts = 0;
  while (attempts < 5) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (profile) return profile;
    attempts++;
    logger.trace(
      { userId: user.id, attempt: attempts },
      `[AuthCallback] Perfil no encontrado. Esperando 300ms...`
    );
    await delay(300);
  }
  return null;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/dashboard";
  const redirectTo = isValidRedirect(next)
    ? new URL(`${origin}${next}`)
    : new URL(`${origin}/dashboard`);

  if (code) {
    const supabase = createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && session) {
      logger.info(
        { userId: session.user.id },
        "[AuthCallback] Sesión creada. Esperando perfil..."
      );

      const profile = await waitForProfile(session.user);
      if (!profile) {
        logger.error(
          { userId: session.user.id },
          "[AuthCallback] INCONSISTENCIA CRÍTICA: Perfil no fue creado a tiempo."
        );
        await supabase.auth.signOut();
        const errorUrl = new URL(`${origin}/login`);
        errorUrl.searchParams.set("error", "true");
        errorUrl.searchParams.set("message", "error_profile_creation_failed");
        return NextResponse.redirect(errorUrl);
      }

      const { data: firstWorkspace } = await supabase
        .from("workspaces")
        .select("id")
        .eq("owner_id", session.user.id)
        .limit(1)
        .single();

      const response = NextResponse.redirect(redirectTo);
      if (firstWorkspace) {
        response.cookies.set("active_workspace_id", firstWorkspace.id, {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
        });
      }
      return response;
    }
  }

  const errorUrl = new URL(`${origin}/login`);
  errorUrl.searchParams.set("error", "true");
  errorUrl.searchParams.set("message", "error_oauth_failed");
  return NextResponse.redirect(errorUrl);
}
// src/app/api/auth/callback/route.ts
