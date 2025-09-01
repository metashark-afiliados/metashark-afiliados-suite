// src/lib/actions/auth/signUp.action.ts
/**
 * @file signUp.action.ts
 * @description Server Action atómica para el registro de nuevos usuarios.
 *              Valida el payload, interactúa con Supabase Auth y gestiona el
 *              flujo de éxito (redirección) y error de forma robusta.
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/auth/signUp.action.ts.md
 */
"use server";
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, SignUpSchema } from "@/lib/validators";

export async function signUpAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<never>> {
  const origin = headers().get("origin");
  const rawData = Object.fromEntries(formData.entries());

  try {
    const parsedData = SignUpSchema.parse(rawData);
    logger.trace("[AuthAction:SignUp] Payload de registro validado.", {
      email: parsedData.email,
    });

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: parsedData.email,
      password: parsedData.password,
      options: { emailRedirectTo: `${origin}/api/auth/callback` },
    });

    if (error) {
      logger.error("[AuthAction:SignUp] Error al crear usuario en Supabase", {
        errorMessage: error.message,
        email: parsedData.email,
      });
      if (error.message.includes("User already registered")) {
        return {
          success: false,
          error: "ValidationErrors.generic.error_user_already_exists",
        };
      }
      return {
        success: false,
        error: "ValidationErrors.generic.error_signup_failed",
      };
    }

    logger.info(
      `[AuthAction:SignUp] Registro exitoso iniciado para ${parsedData.email}. Redirigiendo...`
    );
    redirect("/auth-notice?message=check-email-for-confirmation");
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("[AuthAction:SignUp] Validación de payload fallida.", {
        errors: error.flatten(),
      });
      return { success: false, error: error.errors[0].message };
    }

    const emailForLog =
      typeof rawData.email === "string" ? rawData.email : "invalid_email_type";
    await createPersistentErrorLog("signUpAction", error as Error, {
      email: emailForLog,
    });

    return {
      success: false,
      error: "ValidationErrors.generic.error_unexpected",
    };
  }
}
// src/lib/actions/auth/signUp.action.ts
