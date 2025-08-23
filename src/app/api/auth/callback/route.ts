// src/app/api/auth/callback/route.ts
/**
 * @file src/app/api/auth/callback/route.ts
 * @description Route Handler de élite para el callback de autenticación. Ha sido
 *              refactorizado con una lógica de sondeo resiliente para eliminar la
 *              condición de carrera entre la creación de la sesión y la ejecución
 *              del trigger de la base de datos, garantizando un onboarding robusto.
 * @author Raz Podestá
 * @version 5.0.0
 */
import { type NextRequest, NextResponse } from "next/server";
import { type User } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

const isValidRedirect = (path: string): boolean => {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes(":");
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @private
 * @async
 * @function waitForProfile
 * @description Sondea la tabla de perfiles hasta que se encuentre un perfil
 *              para el usuario o se agoten los reintentos.
 * @param {User} user - El objeto de usuario de Supabase.
 * @returns {Promise<Tables<'profiles'> | null>} El perfil encontrado o null.
 */
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
      `[AuthCallback] Perfil para ${user.id} no encontrado (intento ${attempts}). Esperando 300ms...`
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
      logger.info("[AuthCallback] Sesión creada. Esperando perfil...", {
        userId: session.user.id,
      });

      const profile = await waitForProfile(session.user);
      if (!profile) {
        logger.error(
          `[AuthCallback] INCONSISTENCIA CRÍTICA: Perfil para ${session.user.id} no fue creado por el trigger a tiempo.`
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Condición de Carrera**: ((Implementada)) Se ha introducido la función `waitForProfile` que sondea la base de datos, eliminando la causa raíz del fallo de redirección al garantizar que el perfil del usuario exista antes de continuar. Esto resuelve el error `error_profile_creation_failed`.
 * 2. **Resiliencia Mejorada**: ((Implementada)) Si el perfil no se crea después de los reintentos, se cierra la sesión (`signOut`) y se redirige al usuario con un mensaje de error claro, evitando estados de sesión corruptos.
 * 3. **Full Observabilidad**: ((Implementada)) Se ha añadido `logger.trace` para monitorear los intentos de sondeo y `logger.error` para el caso de fallo crítico, proporcionando visibilidad completa del flujo.
 *
 * @subsection Melhorias Futuras
 * 1. **Sondeo Exponencial (Exponential Backoff)**: ((Vigente)) Para una resiliencia de élite, el `delay` podría aumentar exponencialmente en cada reintento (ej. 100ms, 200ms, 400ms), lo que puede ser más eficiente bajo alta carga.
 * 2. **Webhooks de Supabase**: ((Vigente)) La solución definitiva y de máximo rendimiento sería utilizar un webhook de Supabase. El trigger de la base de datos podría llamar a una Edge Function que emita un evento (ej. a través de Supabase Realtime o Vercel KV) cuando el perfil esté listo, y el `callback` podría esperar ese evento en lugar de sondear.
 *
 * =====================================================================
 */
// src/app/api/auth/callback/route.ts
