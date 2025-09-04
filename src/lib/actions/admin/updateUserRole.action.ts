// src/lib/actions/admin/updateUserRole.action.ts
/**
 * @file updateUserRole.action.ts
 * @description Server Action atómica y de alto privilegio para la gestión de roles.
 *              Refactorizada para cumplir con el contrato de errores soberanos (AD-004)
 *              y la observabilidad completa, incluyendo la firma de logging canónica.
 * @author Raz Podesta - MetaShark Tech
 * @version 4.0.0
 */
"use server";
import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { ZodError } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { requireAppRole } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/server";
import { type Database } from "@/lib/types/database";
import {
  type ActionResult,
  UpdateUserRoleSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function updateUserRoleAction
 * @description [Privilegio: developer] Actualiza el rol de aplicación de un usuario.
 *              Esta acción es de alto impacto y debe ser auditada rigurosamente.
 * @param {string} userId - El ID del usuario a modificar.
 * @param {Database["public"]["Enums"]["app_role"]} newRole - El nuevo rol a asignar.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación. No contiene
 *          datos en caso de éxito.
 */
export async function updateUserRoleAction(
  userId: string,
  newRole: Database["public"]["Enums"]["app_role"]
): Promise<ActionResult<void>> {
  // 1. Autenticación y Autorización
  const roleCheck = await requireAppRole(["developer"]);
  if (!roleCheck.success) {
    return { success: false, error: roleCheck.error as ValidationErrorKey };
  }
  const { user: actor } = roleCheck.data;

  const context = {
    actorId: actor.id,
    targetUserId: userId,
    newRole,
  };

  logger.trace(context, "[updateUserRoleAction] Iniciando acción.");

  try {
    // 2. Validación de Payload
    const validation = UpdateUserRoleSchema.safeParse({ userId, newRole });
    if (!validation.success) {
      throw validation.error;
    }

    if (actor.id === userId) {
      logger.warn(
        context,
        "[updateUserRoleAction] Intento de auto-modificación de rol bloqueado."
      );
      return {
        success: false,
        error: "admin.update_user_role_self_role_change_forbidden",
      };
    }

    // 3. Ejecución de Lógica de Negocio
    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase
      .from("profiles")
      .update({ app_role: newRole })
      .eq("id", userId);

    if (error) {
      throw error;
    }

    // 4. Efectos Secundarios y Retorno
    revalidatePath("/dev-console/users");
    revalidateTag(`user-role:${userId}`);

    await createAuditLog("user.role_updated", {
      userId: actor.id,
      targetEntityId: userId,
      targetEntityType: "user",
      metadata: { newRole },
    });

    logger.info(context, "[updateUserRoleAction] Rol actualizado con éxito.");

    return { success: true, data: undefined };
  } catch (error) {
    let errorKey: ValidationErrorKey = "admin.update_user_role_failed";
    if (error instanceof ZodError) {
      errorKey = "generic.error_invalid_data";
    }

    const errorId = await createPersistentErrorLog(
      "updateUserRoleAction",
      error as Error,
      context
    );

    logger.error(
      { err: error, errorId, ...context },
      "[updateUserRoleAction] Fallo en la acción."
    );

    return {
      success: false,
      error: errorKey,
    };
  }
}
// src/lib/actions/admin/updateUserRole.action.ts
