// src/lib/actions/admin/impersonateUser.action.ts
/**
 * @file impersonateUser.action.ts
 * @description Server Action atómica y de alto privilegio para la suplantación
 *              de usuarios. Refactorizada para cumplir con el contrato de
 *              errores soberanos (AD-004) y la observabilidad completa.
 * @author Raz Podesta - MetaShark Tech
 * @version 4.0.0
 */
"use server";
import "server-only";

import { ZodError } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { requireAppRole } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  ImpersonationSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function impersonateUserAction
 * @description [Privilegio: developer] Genera un enlace mágico para suplantar a un usuario.
 *              Esta acción es de alto impacto y debe ser auditada rigurosamente.
 * @param {FormData} formData - Datos del formulario que deben contener `userId`.
 * @returns {Promise<ActionResult<{ signInLink: string }>>} El resultado de la operación,
 *          conteniendo el enlace de inicio de sesión en caso de éxito.
 */
export async function impersonateUserAction(
  formData: FormData
): Promise<ActionResult<{ signInLink: string }>> {
  // 1. Autenticación y Autorización
  const roleCheck = await requireAppRole(["developer"]);
  if (!roleCheck.success) {
    return { success: false, error: roleCheck.error as ValidationErrorKey };
  }
  const { user: actor } = roleCheck.data;
  const rawData = Object.fromEntries(formData.entries());
  const context = { actorId: actor.id, payload: rawData };

  logger.trace(context, "[impersonateUserAction] Iniciando acción.");

  try {
    // 2. Validación de Payload
    const { userId } = ImpersonationSchema.parse(rawData);
    context.payload.userId = userId; // Actualizar contexto con ID validado

    if (actor.id === userId) {
      logger.warn(
        context,
        "[impersonateUserAction] Intento de auto-suplantación bloqueado."
      );
      return {
        success: false,
        error: "admin.impersonation_self_impersonation_forbidden",
      };
    }

    // 3. Ejecución de Lógica de Negocio
    const adminSupabase = createAdminClient();
    const { data: userData, error: userError } =
      await adminSupabase.auth.admin.getUserById(userId);

    if (userError || !userData.user) {
      throw userError || new Error("User not found for impersonation");
    }

    const { data, error: linkError } =
      await adminSupabase.auth.admin.generateLink({
        type: "magiclink",
        email: userData.user.email!,
      });

    if (linkError) {
      throw linkError;
    }

    // 4. Efectos Secundarios (Auditoría) y Retorno
    await createAuditLog("user.impersonated", {
      userId: actor.id,
      targetEntityId: userId,
      targetEntityType: "user",
      metadata: { impersonatedEmail: userData.user.email },
    });

    logger.info(
      context,
      "[impersonateUserAction] Suplantación exitosa. Enlace generado."
    );

    return { success: true, data: { signInLink: data.properties.action_link } };
  } catch (error) {
    let errorKey: ValidationErrorKey = "generic.error_unexpected";

    if (error instanceof ZodError) {
      errorKey = "generic.error_invalid_data";
    } else if (error instanceof Error) {
      if (error.message.includes("User not found")) {
        errorKey = "admin.impersonation_user_not_found";
      } else {
        errorKey = "admin.impersonation_link_generation_failed";
      }
    }

    const errorId = await createPersistentErrorLog(
      "impersonateUserAction",
      error as Error,
      context
    );

    logger.error(
      { err: error, errorId, ...context },
      "[impersonateUserAction] Fallo en la acción."
    );

    return {
      success: false,
      error: errorKey,
    };
  }
}
// src/lib/actions/admin/impersonateUser.action.ts
