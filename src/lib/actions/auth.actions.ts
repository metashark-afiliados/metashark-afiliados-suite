// src/lib/actions/auth.actions.ts
/**
 * @file src/lib/actions/auth.actions.ts
 * @description SSoT de Server Actions para el ciclo de vida de autenticación.
 *              Ha sido refactorizado holísticamente para **centralizar todos
 *              los mensajes de error en el namespace `shared.ValidationErrors`**,
 *              alineando la gestión de errores con la "Única Fuente de Verdad"
 *              para los errores de la aplicación.
 * @author Raz Podestá - MetaShark Tech
 * @version 11.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
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
} from "@/lib/validators/index.ts";

export async function signInWithEmailAction(
  prevState: any,
  formData: FormData
): Promise<ActionResult<never>> {
  const emailResult = EmailSchema.safeParse(formData.get("email"));
  const passwordResult = PasswordSchema.safeParse(formData.get("password"));

  if (!emailResult.success || !passwordResult.success) {
    // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
    return {
      success: false,
      error: "ValidationErrors.auth_login_invalid_credentials",
    };
    // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: emailResult.data,
    password: passwordResult.data,
  });

  if (error) {
    logger.warn(
      `[AuthActions] Failed password sign-in for ${emailResult.data}`,
      { error: error.message }
    );
    // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
    return {
      success: false,
      error: "ValidationErrors.auth_login_invalid_credentials",
    };
    // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
  }

  redirect("/dashboard");
}

export async function signUpAction(
  prevState: any,
  formData: FormData
): Promise<ActionResult<never>> {
  const origin = headers().get("origin");
  const rawData = Object.fromEntries(formData);

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
        // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
        return {
          success: false,
          error: "ValidationErrors.error_user_already_exists",
        };
        // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
      }
      // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
      return { success: false, error: "ValidationErrors.error_signup_failed" };
      // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
    }

    redirect("/auth-notice?message=check-email-for-confirmation");
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      return { success: false, error: firstError.message }; // Zod errors already reference ValidationErrors keys
    }

    const emailForLog =
      typeof rawData.email === "string" ? rawData.email : "invalid_email_type";
    await createPersistentErrorLog("signUpAction", error as Error, {
      email: emailForLog,
    });

    return { success: false, error: "ValidationErrors.error_unexpected" };
  }
}

export async function signInWithOAuthAction(formData: FormData): Promise<void> {
  const provider = formData.get("provider") as Provider | null;
  const origin = headers().get("origin");
  const loginUrl = new URL(`${origin}/login`);

  if (!provider) {
    // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
    loginUrl.searchParams.set(
      "message",
      "ValidationErrors.auth_oauth_provider_missing"
    );
    // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
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
    await createPersistentErrorLog("signInWithOAuthAction", error, {
      provider,
    });
    // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
    loginUrl.searchParams.set("message", "ValidationErrors.auth_oauth_failed");
    // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
    return redirect(loginUrl.toString());
  }

  return redirect(data.url);
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 11.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Centralización de Errores (SSoT)**: ((Implementada)) Todos los mensajes de error devueltos por las Server Actions de autenticación ahora utilizan claves del namespace `shared.ValidationErrors`. Esto consolida la "Única Fuente de Verdad" para los mensajes de error en toda la aplicación.
 * 2. **Consistencia en el Manejo de Errores**: ((Implementada)) Se ha estandarizado la forma en que los errores son reportados por la Server Action, haciendo que el `ActionResult` de error sea más predecible para los componentes consumidores (ej. `login-form.tsx`).
 * 3. **Observabilidad Mejorada**: ((Implementada)) La Server Action `signInWithOAuthAction` ahora registra el mensaje de error de OAuth en el log persistente, mejorando la capacidad de diagnóstico.
 *
 * @subsection Melhorias Futuras
 * 1. **Helper `sanitizeFormData`**: ((Vigente)) La lógica de sanitización (`typeof rawData.email === 'string' ? ...`) es un patrón que podría abstraerse a un helper reutilizable.
 * 2. **Tipado Estricto de Claves de Error en `toast.error`**: ((Vigente)) Los componentes de cliente que consumen estas acciones (`login-form.tsx`) deberían ser actualizados para usar el guardián de tipo `isActionError` y `tErrors(result.error)` de forma más segura.
 *
 * =====================================================================
 */
