// src/lib/actions/auth.actions.ts
/**
 * @file src/lib/actions/auth.actions.ts
 * @description SSoT de Server Actions para el ciclo de vida de autenticación.
 *              Corregido para importar explícitamente desde el manifiesto
 *              del módulo de validadores.
 * @author Raz Podestá
 * @version 10.1.1
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
// --- INICIO DE CORRECCIÓN DE IMPORTACIÓN ---
import {
  type ActionResult,
  EmailSchema,
  PasswordSchema,
  SignUpSchema,
} from "@/lib/validators/index.ts";
// --- FIN DE CORRECCIÓN DE IMPORTACIÓN ---

export async function signInWithEmailAction(
  prevState: any,
  formData: FormData
): Promise<ActionResult<never>> {
  const emailResult = EmailSchema.safeParse(formData.get("email"));
  const passwordResult = PasswordSchema.safeParse(formData.get("password"));

  if (!emailResult.success || !passwordResult.success) {
    return { success: false, error: "LoginPage.error_invalid_credentials" };
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
    return { success: false, error: "LoginPage.error_invalid_credentials" };
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
        return {
          success: false,
          error: "ValidationErrors.error_user_already_exists",
        };
      }
      return { success: false, error: "ValidationErrors.error_signup_failed" };
    }

    redirect("/auth-notice?message=check-email-for-confirmation");
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      return { success: false, error: firstError.message };
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
    loginUrl.searchParams.set("error", "true");
    loginUrl.searchParams.set(
      "message",
      "LoginPage.error_oauth_provider_missing"
    );
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
    loginUrl.searchParams.set("error", "true");
    loginUrl.searchParams.set("message", "LoginPage.error_oauth_failed");
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
 * 1. **Resolución de Error de Compilación `TS2307`**: ((Implementada)) La ruta de importación de los schemas y el tipo `ActionResult` ha sido corregida a `@/lib/validators/index.ts`.
 *
 * @subsection Melhorias Futuras
 * 1. **Helper `sanitizeFormData`**: ((Vigente)) La lógica de sanitización (`typeof rawData.email === 'string' ? ...`) es un patrón que podría abstraerse a un helper reutilizable.
 *
 * =====================================================================
 */
// src/lib/actions/auth.actions.ts
