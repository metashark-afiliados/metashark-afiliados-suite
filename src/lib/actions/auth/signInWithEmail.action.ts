// src/lib/actions/auth/signInWithEmail.action.ts
/**
 * @file signInWithEmail.action.ts
 * @description Server Action atómica para el inicio de sesión con credenciales.
 *              Valida el payload, interactúa con Supabase Auth y gestiona el
 *              flujo de éxito (redirección) y error.
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/auth/signInWithEmail.action.ts.md
 */
"use server";
import "server-only";

import { redirect } from "next/navigation";

import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, SignInSchema } from "@/lib/validators";

export async function signInWithEmailAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<never>> {
  const rawData = Object.fromEntries(formData.entries());
  logger.trace("[AuthAction:SignIn] Intento de inicio de sesión con email.", {
    email: rawData.email,
  });

  const validationResult = SignInSchema.safeParse(rawData);

  if (!validationResult.success) {
    logger.warn("[AuthAction:SignIn] Validación de payload fallida.", {
      errors: validationResult.error.flatten(),
    });
    return {
      success: false,
      error: "ValidationErrors.auth.login_invalid_credentials",
    };
  }

  const { email, password } = validationResult.data;
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    logger.warn(`[AuthAction:SignIn] Fallo de credenciales para ${email}`, {
      error: error.message,
    });
    return {
      success: false,
      error: "ValidationErrors.auth.login_invalid_credentials",
    };
  }

  logger.info(
    `[AuthAction:SignIn] Inicio de sesión exitoso para ${email}. Redirigiendo...`
  );
  redirect("/dashboard");
}
// src/lib/actions/auth/signInWithEmail.action.ts
