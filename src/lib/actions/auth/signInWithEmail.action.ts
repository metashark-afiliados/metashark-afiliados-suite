// src/lib/actions/auth/signInWithEmail.action.ts
/**
 * @file signInWithEmail.action.ts
 * @description Server Action atómica para el inicio de sesión con credenciales.
 *              Refactorizada para cumplir con el contrato de errores soberanos (AD-004),
 *              observabilidad completa, y la firma de logging canónica de Pino.
 * @author Raz Podesta - MetaShark Tech
 * @version 4.0.0
 */
"use server";
import "server-only";

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
  SignInSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function signInWithEmailAction
 * @description Procesa una solicitud de inicio de sesión con email y contraseña. Sigue
 *              el ciclo de vida canónico de una Server Action: valida, ejecuta, audita
 *              y maneja errores.
 * @param {unknown} prevState - El estado anterior del formulario, requerido por `useFormState`.
 * @param {FormData} formData - Los datos del formulario de inicio de sesión.
 * @returns {Promise<ActionResult<never>>} El resultado de la operación. En caso de éxito,
 *          ejecuta una redirección y no retorna valor. En caso de fallo, retorna un
 *          `ActionResult` de error.
 */
export async function signInWithEmailAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<never>> {
  const rawData = Object.fromEntries(formData.entries());
  const context = { payload: rawData };

  logger.trace(context, "[signInWithEmailAction] Iniciando acción.");

  try {
    // 1. Validación de Payload
    const validationResult = SignInSchema.safeParse(rawData);
    if (!validationResult.success) {
      throw validationResult.error;
    }
    const { email, password } = validationResult.data;

    // 2. Ejecución de Lógica de Negocio
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logger.warn(
        { email, err: error },
        "[signInWithEmailAction] Fallo de credenciales."
      );
      await createAuditLog("login.failed", {
        metadata: { email, reason: "invalid_credentials" },
      });
      return { success: false, error: "auth.login_invalid_credentials" };
    }

    // 3. Efectos Secundarios y Retorno
    await createAuditLog("login.success", { userId: data.user.id });
    logger.info(
      { userId: data.user.id },
      "[signInWithEmailAction] Inicio de sesión exitoso. Redirigiendo."
    );

    redirect("/dashboard");
  } catch (error) {
    let errorKey: ValidationErrorKey = "generic.error_server_generic";

    if (error instanceof ZodError) {
      errorKey = "generic.error_invalid_data";
      logger.warn(
        { errors: error.flatten(), ...context },
        "[signInWithEmailAction] Validación de payload fallida."
      );
    }

    const errorId = await createPersistentErrorLog(
      "signInWithEmailAction",
      error as Error,
      context
    );

    logger.error(
      { err: error, errorId, ...context },
      "[signInWithEmailAction] Fallo en la acción."
    );

    return { success: false, error: errorKey };
  }
}
// src/lib/actions/auth/signInWithEmail.action.ts
