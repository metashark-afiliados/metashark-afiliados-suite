// src/lib/actions/auth.actions.ts
/**
 * @file src/lib/actions/auth.actions.ts
 * @description Contiene las Server Actions para el flujo de autenticación soberano.
 *              Ha sido nivelado para alinearse con la nueva API de exportación
 *              atómica de los helpers, resolviendo un error de compilación crítico.
 * @author Raz Podestá
 * @version 2.1.0
 */
"use server";
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { type Provider } from "@supabase/supabase-js";
import { ZodError } from "zod";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  SignInSchema,
  SignUpSchema,
} from "@/lib/validators";

// --- INICIO DE CORRECCIÓN DE IMPORTACIÓN ---
import { createAuditLog, checkRateLimit } from "./_helpers";
// --- FIN DE CORRECCIÓN DE IMPORTACIÓN ---

export async function signInWithOAuthAction(
  formData: FormData
): Promise<ActionResult<never>> {
  const provider = formData.get("provider") as Provider | null;
  if (!provider) {
    return { success: false, error: "Proveedor OAuth no especificado." };
  }
  const supabase = createClient();
  const origin = headers().get("origin");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${origin}/api/auth/callback` },
  });
  if (error) {
    logger.error(`[AuthActions] Error al iniciar OAuth con ${provider}`, error);
    return { success: false, error: "No se pudo iniciar sesión con OAuth." };
  }
  return redirect(data.url);
}

export async function signUpAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<null>> {
  // ... (lógica interna sin cambios)
  const supabase = createClient();
  const rawData = Object.fromEntries(formData);
  try {
    const { email, password } = SignUpSchema.parse(rawData);
    const origin = headers().get("origin");
    const emailRedirectTo = `${origin}/api/auth/callback`;
    logger.trace(`[AuthActions] Iniciando registro para ${email}`);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo },
    });
    if (error) {
      logger.warn(`[AuthActions] Fallo en el registro para ${email}`, {
        message: error.message,
      });
      return {
        success: false,
        error:
          "No se pudo completar el registro. El correo electrónico ya podría estar en uso.",
      };
    }
    await createAuditLog("user_signup_initiated", { metadata: { email } });
    logger.info(`[AuthActions] Registro exitoso para ${email}. Esperando confirmación.`);
    redirect("/auth-notice?message=check-email-for-confirmation");
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("[AuthActions] Datos de registro inválidos.", { errors: error.flatten() });
      return { success: false, error: "Datos de registro inválidos." };
    }
    logger.error("[AuthActions] Error inesperado en signUpAction", { error });
    return { success: false, error: "Un error inesperado ocurrió." };
  }
}

export async function signInWithPasswordAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<null>> {
  const ip = headers().get("x-forwarded-for");
  // --- INICIO DE CORRECCIÓN DE CONSUMO ---
  const limit = await checkRateLimit(ip, "login");
  // --- FIN DE CORRECCIÓN DE CONSUMO ---
  if (!limit.success) {
    return { success: false, error: limit.error! };
  }
  const rawData = Object.fromEntries(formData);
  try {
    const { email, password } = SignInSchema.parse(rawData);
    const supabase = createClient();
    logger.trace(`[AuthActions] Iniciando intento de inicio de sesión para ${email}`);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      await createAuditLog("user_login_failed", {
        metadata: { email, reason: error.message },
      });
      logger.warn(`[AuthActions] Intento de login fallido para ${email}`, {
        message: error.message,
      });
      return { success: false, error: "Credenciales inválidas." };
    }
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("[AuthActions] Datos de inicio de sesión inválidos.", {
        errors: error.flatten(),
      });
      return { success: false, error: "Datos de inicio de sesión inválidos." };
    }
    logger.error("[AuthActions] Error inesperado en signInAction", { error });
    return { success: false, error: "Un error inesperado ocurrió." };
  }
  redirect("/dashboard");
}
// src/lib/actions/auth.actions.ts
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cero Regresiones**: ((Implementada)) Se han restaurado las acciones `signUpAction` y `signInWithPasswordAction` del snapshot, garantizando que la funcionalidad de autenticación por email no se pierda.
 * 2. **Funcionalidad OAuth**: ((Implementada)) Se ha añadido la nueva `signInWithOAuthAction`, cumpliendo con la directiva de mejora y preparando la aplicación para la integración con Google.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Errores I18n**: ((Vigente)) Devolver claves de internacionalización en lugar de strings codificados para que la UI muestre mensajes traducidos.
 *
 * =====================================================================
 */
// src/lib/actions/auth.actions.ts
