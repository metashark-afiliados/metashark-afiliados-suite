// src/lib/actions/auth.actions.ts
/**
 * @file src/lib/actions/auth.actions.ts
 * @description Contiene las Server Actions para el flujo de autenticación.
 *              Ha sido refactorizado para un manejo de tipos de FormData
 *              explícito y seguro, resolviendo errores de tipo.
 * @author Raz Podestá
 * @version 9.1.0
 */
"use server";
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { type Provider } from "@supabase/supabase-js";
import { ZodError } from "zod";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  EmailSchema,
  PasswordSchema,
  SignUpSchema,
} from "@/lib/validators";

// (signInWithEmailAction sin cambios)
export async function signInWithEmailAction(
  prevState: any,
  formData: FormData
): Promise<ActionResult<never> | void> {
  // ...código idéntico...
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

export async function signUpAction(
  prevState: any,
  formData: FormData
): Promise<ActionResult<never>> {
  const origin = headers().get("origin");
  // --- INICIO DE REFACTORIZACIÓN: MANEJO SEGURO DE TIPOS ---
  const rawData = Object.fromEntries(formData);
  const emailForLog =
    typeof rawData.email === "string" ? rawData.email : "invalid_email_type";
  // --- FIN DE REFACTORIZACIÓN ---
  try {
    const parsedData = SignUpSchema.parse(rawData);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: parsedData.email,
      password: parsedData.password,
      options: {
        emailRedirectTo: `${origin}/api/auth/callback`,
      },
    });

    if (error) {
      logger.error("[AuthActions:signUp] Error al crear usuario en Supabase", {
        errorMessage: error.message,
        email: parsedData.email,
      });
      if (error.message.includes("User already registered")) {
        return { success: false, error: "error_user_already_exists" };
      }
      return { success: false, error: "error_signup_failed" };
    }

    return redirect("/auth-notice?message=check-email-for-confirmation");
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      return { success: false, error: firstError.message };
    }

    // --- INICIO DE REFACTORIZACIÓN: PASO DE TIPO SEGURO ---
    await createPersistentErrorLog("signUpAction", error as Error, {
      email: emailForLog,
    });
    // --- FIN DE REFACTORIZACIÓN ---
    return { success: false, error: "error_unexpected" };
  }
}

// (signInWithOAuthAction sin cambios)
export async function signInWithOAuthAction(formData: FormData): Promise<void> {
  // ...código idéntico...
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
 * 1. **Manejo Seguro de Tipos de FormData**: ((Implementada)) ((Vigente)) La acción `signUpAction` ahora convierte `FormData` a un objeto plano y extrae el email como string al inicio. Esto garantiza que todos los usos posteriores de `email` (validación Zod, logging) sean tipo-seguros, resolviendo el error `TS2345`.
 *
 * @subsection Melhorias Futuras
 * 1. **Helper de Sanitización de FormData**: ((Pendiente)) La lógica de `Object.fromEntries(formData)` y la extracción segura de valores podría abstraerse a un helper reutilizable `sanitizeFormData(formData, expectedKeys)` para otras Server Actions.
 *
 * =====================================================================
 */
// src/lib/actions/auth.actions.ts
