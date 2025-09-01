// src/lib/actions/auth/signInWithOAuth.action.ts
/**
 * @file signInWithOAuth.action.ts
 * @description Server Action atómica para el inicio de sesión con proveedores OAuth.
 *              Valida el proveedor, interactúa con Supabase Auth para generar
 *              la URL de autorización y redirige al usuario.
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/auth/signInWithOAuth.action.ts.md
 */
"use server";
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { type Provider } from "@supabase/supabase-js";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

export async function signInWithOAuthAction(formData: FormData): Promise<void> {
  const provider = formData.get("provider") as Provider | null;
  const origin = headers().get("origin");
  const loginUrl = new URL(`${origin}/login`);

  if (!provider) {
    logger.warn(
      "[AuthAction:OAuth] Intento de inicio de sesión OAuth sin proveedor especificado."
    );
    loginUrl.searchParams.set(
      "errorKey",
      "ValidationErrors.auth.oauth_provider_missing"
    );
    return redirect(loginUrl.toString());
  }

  logger.info(`[AuthAction:OAuth] Iniciando flujo OAuth para ${provider}.`);
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${origin}/api/auth/callback` },
  });

  if (error) {
    await createPersistentErrorLog("signInWithOAuthAction", error, {
      provider,
    });
    loginUrl.searchParams.set("errorKey", "ValidationErrors.auth.oauth_failed");
    return redirect(loginUrl.toString());
  }

  logger.trace(
    `[AuthAction:OAuth] Redirigiendo a la URL del proveedor: ${data.url}`
  );
  redirect(data.url);
}
// src/lib/actions/auth/signInWithOAuth.action.ts
