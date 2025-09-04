// src/lib/actions/auth/signUp.action.ts
/**
 * @file signUp.action.ts
 * @description Server Action atómica para el registro de nuevos usuarios.
 *              Refactorizada para cumplir con el contrato de errores soberanos (AD-004),
 *              observabilidad completa, y la firma de logging canónica de Pino.
 * @author Raz Podesta - MetaShark Tech
 * @version 4.0.0
 */
"use server";
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  SignUpSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function signUpAction
 * @description Procesa una solicitud de registro de nuevo usuario, validando los datos,
 *              creando el usuario en Supabase, auditando el evento y manejando errores.
 * @param {unknown} prevState - El estado anterior del formulario, requerido por `useFormState`.
 * @param {FormData} formData - Los datos del formulario de registro.
 * @returns {Promise<ActionResult<never>>} El resultado de la operación. En caso de éxito,
 *          ejecuta una redirección y no retorna valor. En caso de fallo, retorna un
 *          `ActionResult` de error con una `ValidationErrorKey`.
 */
export async function signUpAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<never>> {
  const origin = headers().get("origin");
  const rawData = Object.fromEntries(formData.entries());
  const context = { payload: rawData, origin };

  logger.trace(context, "[signUpAction] Iniciando acción de registro.");

  try {
    // 1. Validación de Payload
    const parsedData = SignUpSchema.parse(rawData);
    const { email, password } = parsedData;

    // 2. Ejecución de Lógica de Negocio
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${origin}/api/auth/callback` },
    });

    if (error) {
      if (error.message.includes("User already registered")) {
        logger.warn(
          { email, ...context },
          "[signUpAction] Intento de registro con email duplicado."
        );
        return { success: false, error: "generic.error_user_already_exists" };
      }
      throw error; // Lanzar otros errores de Supabase para el catch genérico
    }

    // 3. Efectos Secundarios y Retorno
    if (data.user) {
      await createAuditLog("signup.success", {
        userId: data.user.id,
        metadata: { email: data.user.email },
      });
    }

    logger.info(
      { email, userId: data.user?.id, ...context },
      "[signUpAction] Registro iniciado con éxito."
    );
    redirect("/auth-notice?message=check-email-for-confirmation");
  } catch (error) {
    let errorKey: ValidationErrorKey;

    if (error instanceof ZodError) {
      // Propaga la clave de error directamente desde el schema de Zod
      errorKey = error.errors[0].message as ValidationErrorKey;
      logger.warn(
        { errors: error.flatten(), ...context },
        "[signUpAction] Validación de payload fallida."
      );
    } else {
      errorKey = "generic.error_signup_failed";
    }

    const errorId = await createPersistentErrorLog(
      "signUpAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      "[signUpAction] Fallo en la acción."
    );

    return { success: false, error: errorKey };
  }
}
// src/lib/actions/auth/signUp.action.ts
