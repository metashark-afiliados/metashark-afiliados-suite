// src/lib/actions/auth.actions.ts
/**
 * @file src/lib/actions/auth.actions.ts
 * @description Contiene las Server Actions para el flujo de autenticación.
 *              Ha sido refactorizado a un estándar de élite. La acción `signInWithOAuthAction`
 *              ahora cumple el contrato de retorno `Promise<void>` de React para `form action`,
 *              manejando errores a través de redirecciones con parámetros de URL.
 * @author Raz Podestá
 * @version 7.1.0
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

const isDevMode =
  process.env.NODE_ENV === "development" &&
  process.env.DEV_MODE_ENABLED === "true";

/**
 * @public
 * @async
 * @function signInWithEmailAction
 * @description Maneja el inicio de sesión con email/contraseña.
 * @param {any} prevState - Estado anterior del formulario.
 * @param {FormData} formData - Datos del formulario.
 * @returns {Promise<ActionResult<never> | void>}
 */
export async function signInWithEmailAction(
  prevState: any,
  formData: FormData
): Promise<ActionResult<never> | void> {
  const origin = headers().get("origin");

  if (isDevMode) {
    logger.info("[AuthActions:DevMock] Simulating email sign-in redirect.");
    return redirect(`${origin}/api/auth/callback?code=dev-mock-code`);
  }

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
  const origin = headers().get("origin");

  if (isDevMode) {
    logger.info("[AuthActions:DevMock] Simulating sign-up redirect.");
    return redirect(`${origin}/api/auth/callback?code=dev-mock-code`);
  }

  // Lógica de producción...
  throw new Error("Sign-up not implemented for production.");
}

/**
 * @public
 * @async
 * @function signInWithOAuthAction
 * @description Inicia el flujo de autenticación con un proveedor OAuth.
 * @param {FormData} formData - Datos del formulario.
 * @returns {Promise<void>} Redirige al usuario. No devuelve valor en caso de error.
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

  if (isDevMode) {
    logger.info(
      `[AuthActions:DevMock] Simulating OAuth redirect for provider: ${provider}`
    );
    return redirect(`${origin}/api/auth/callback?code=dev-mock-code`);
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
 * 1. **Contrato de API Consistente**: ((Implementada)) La acción `signInWithOAuthAction` ahora siempre devuelve `Promise<void>`. Los errores se manejan redirigiendo al usuario a la página de login con parámetros de error, cumpliendo el contrato esperado por React y resolviendo el error TS2322.
 * 2. **Feedback de Usuario Mejorado**: ((Implementada)) El nuevo patrón de redirección permite a la UI (`LoginForm`) mostrar errores específicos de OAuth al usuario.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado de Claves de Error**: ((Vigente)) Los `message` en los `searchParams` son strings. Se podría crear un tipo de unión para estas claves de error (`'error_oauth_provider_missing' | 'error_oauth_failed'`) para mejorar la seguridad de tipos en el componente consumidor.
 *
 * =====================================================================
 */
// src/lib/actions/auth.actions.ts
