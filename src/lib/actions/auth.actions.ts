// src/lib/actions/auth.actions.ts
/**
 * @file src/lib/actions/auth.actions.ts
 * @description Contiene las Server Actions para el flujo de autenticación. Ha sido
 *              refactorizado para "Producción Total", eliminando toda la lógica
 *              condicional de `DEV_MODE`.
 * @author Raz Podestá
 * @version 8.0.0
 */
"use server";
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { type Provider } from "@supabase/supabase-js";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  EmailSchema,
  PasswordSchema,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function signInWithEmailAction
 * @description Maneja el inicio de sesión con email/contraseña, interactuando
 *              siempre con la API real de Supabase Auth.
 * @param {any} prevState - Estado anterior del formulario.
 * @param {FormData} formData - Datos del formulario.
 * @returns {Promise<ActionResult<never> | void>}
 */
export async function signInWithEmailAction(
  prevState: any,
  formData: FormData
): Promise<ActionResult<never> | void> {
  const emailResult = EmailSchema.safeParse(formData.get("email"));
  const passwordResult = PasswordSchema.safeParse(formData.get("password"));

  if (!emailResult.success || !passwordResult.success) {
    return { success: false, error: "error_invalid_credentials" };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: emailResult.data,
    password: passwordResult.data,
  });

  if (error) {
    logger.warn(
      `[AuthActions] Failed password sign-in for ${emailResult.data}`,
      {
        error: error.message,
      }
    );
    return { success: false, error: "error_invalid_credentials" };
  }

  return redirect("/dashboard");
}

/**
 * @public
 * @async
 * @function signUpAction
 * @description Maneja el registro de nuevos usuarios.
 * @param {FormData} formData - Datos del formulario.
 * @returns {Promise<void>}
 */
export async function signUpAction(formData: FormData): Promise<void> {
  // Lógica de producción...
  throw new Error("Sign-up not implemented for production.");
}

/**
 * @public
 * @async
 * @function signInWithOAuthAction
 * @description Inicia el flujo de autenticación con un proveedor OAuth,
 *              interactuando siempre con la API real de Supabase Auth.
 * @param {FormData} formData - Datos del formulario.
 * @returns {Promise<void>} Redirige al usuario.
 */
export async function signInWithOAuthAction(formData: FormData): Promise<void> {
  const provider = formData.get("provider") as Provider | null;
  const origin = headers().get("origin");
  const loginUrl = new URL(`${origin}/auth/login`);

  if (!provider) {
    logger.warn("[AuthActions] Provider de OAuth faltante en la petición.");
    loginUrl.searchParams.set("error", "true");
    loginUrl.searchParams.set("message", "error_oauth_provider_missing");
    return redirect(loginUrl.toString());
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error) {
    logger.error(`[AuthActions] OAuth sign-in error with ${provider}`, error);
    await createPersistentErrorLog("signInWithOAuthAction", error, {
      provider,
    });
    loginUrl.searchParams.set("error", "true");
    loginUrl.searchParams.set("message", "error_oauth_failed");
    return redirect(loginUrl.toString());
  }

  return redirect(data.url);
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Orientado a Producción**: ((Implementada)) Se han eliminado todos los bloques de simulación de `DEV_MODE`. Las acciones ahora siempre ejecutarán la lógica de producción, interactuando con Supabase.
 *
 * @subsection Melhorias Futuras
 * 1. **Implementación de `signUpAction`**: ((Vigente)) La acción de registro aún lanza un error. Necesita ser implementada con la lógica de `supabase.auth.signUp`.
 *
 * =====================================================================
 */
