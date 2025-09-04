// src/lib/actions/password/updatePassword.action.ts
/**
 * @file updatePassword.action.ts
 * @description Server Action atómica para actualizar la contraseña del usuario.
 *              Refactorizada para adherirse estrictamente a la arquitectura
 *              de "Errores Soberanos Codificados" y la firma de logging canónica.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 */
"use server";
import "server-only";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import { getAuthUser } from "@/lib/auth/get-auth-user";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  ResetPasswordSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function updatePasswordAction
 * @description Actualiza la contraseña del usuario actualmente autenticado (a través
 *              del token de recuperación en la URL). Cierra todas las demás sesiones
 *              activas por seguridad.
 * @param {unknown} prevState - El estado anterior del formulario, requerido por `useFormState`.
 * @param {FormData} formData - Los datos del formulario que contienen la nueva contraseña.
 * @returns {Promise<ActionResult<{ messageKey: ValidationErrorKey }>>} El resultado de la operación.
 */
export async function updatePasswordAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<{ messageKey: ValidationErrorKey }>> {
  const rawData = Object.fromEntries(formData);
  const context = { payload: rawData };
  logger.trace(context, "[updatePasswordAction] Iniciando acción.");

  try {
    const validation = ResetPasswordSchema.safeParse(rawData);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      logger.warn(
        { errors: validation.error.flatten(), ...context },
        "[updatePasswordAction] Validación de payload fallida."
      );
      return {
        success: false,
        error: firstError.message as ValidationErrorKey,
      };
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: validation.data.password,
    });

    if (error) {
      logger.error(
        { err: error, ...context },
        "[updatePasswordAction] Error al actualizar contraseña en Supabase."
      );
      if (error.message.includes("token has expired")) {
        return {
          success: false,
          error: "password.update_expired_link",
        };
      }
      return {
        success: false,
        error: "password.update_failed",
      };
    }

    const user = await getAuthUser();
    if (user) {
      await supabase.auth.signOut({ scope: "others" });
      logger.info(
        { userId: user.id },
        "[updatePasswordAction] Todas las otras sesiones del usuario han sido cerradas."
      );
    }

    return {
      success: true,
      data: { messageKey: "password.update_success" },
    };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "updatePasswordAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      "[updatePasswordAction] Error inesperado."
    );
    return {
      success: false,
      error: "generic.error_server_generic",
    };
  }
}
// src/lib/actions/password/updatePassword.action.ts
