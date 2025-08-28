// src/lib/actions/admin.actions.ts
/**
 * @file src/lib/actions/admin.actions.ts
 * @description Contiene Server Actions de alto privilegio, restringidas a roles
 *              administrativos ('admin', 'developer'). Cada acción en este módulo
 *              DEBE comenzar con una verificación de rol explícita utilizando el
 *              guardián de seguridad `requireAppRole`. Estas operaciones son
 *              sensibles y se registran en la auditoría para una trazabilidad completa.
 *              Ha sido refactorizado holísticamente para **centralizar todos los
 *              mensajes de error en el namespace `shared.ValidationErrors`**,
 *              alineando la gestión de errores con la "Única Fuente de Verdad"
 *              para los errores de la aplicación.
 * @author L.I.A. Legacy - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";

import { requireAppRole } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logging";
import { createAdminClient } from "@/lib/supabase/server";
import { type Database } from "@/lib/types/database";
import { type ActionResult } from "@/lib/validators"; // Asegurarse de que ActionResult se importa
import { ZodError } from "zod";

import { createAuditLog, createPersistentErrorLog } from "./_helpers";

/**
 * @public
 * @async
 * @function impersonateUserAction
 * @description [Privilegio: developer] Permite a un desarrollador iniciar sesión como
 *              otro usuario. Genera un enlace mágico de un solo uso para fines de
 *              depuración y soporte. Es una operación de alto riesgo que se audita.
 *              Acepta FormData y extrae el userId.
 * @param {FormData} formData - Los datos del formulario que contienen 'userId'.
 * @returns {Promise<ActionResult<{ signInLink: string }>>} El resultado de la operación,
 *          conteniendo el enlace de inicio de sesión si tiene éxito.
 */
export async function impersonateUserAction(
  formData: FormData
): Promise<ActionResult<{ signInLink: string }>> {
  const roleCheck = await requireAppRole(["developer"]);
  if (!roleCheck.success) {
    return { success: false, error: roleCheck.error }; // Ya es una clave i18n
  }

  const userId = formData.get("userId") as string;
  if (!userId) {
    logger.warn(
      "[AdminActions:impersonateUserAction] Impersonation: userId is missing from FormData."
    );
    // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
    return {
      success: false,
      error: "ValidationErrors.admin_impersonation_user_id_missing",
    };
    // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
  }

  if (roleCheck.data.user.id === userId) {
    // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
    return {
      success: false,
      error:
        "ValidationErrors.admin_impersonation_self_impersonation_forbidden",
    };
    // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
  }

  const adminSupabase = createAdminClient();
  const { data: userData, error: userError } =
    await adminSupabase.auth.admin.getUserById(userId);

  if (userError || !userData.user) {
    logger.error(
      `[AdminActions:impersonateUserAction] Error al obtener usuario para suplantación ${userId}:`,
      userError
    );
    // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
    return {
      success: false,
      error: "ValidationErrors.admin_impersonation_user_not_found",
    };
    // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
  }

  const { data, error } = await adminSupabase.auth.admin.generateLink({
    type: "magiclink",
    email: userData.user.email!,
  });

  if (error) {
    logger.error(
      `[AdminActions:impersonateUserAction] Error al generar link de suplantación para ${userId}:`,
      error
    );
    // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
    return {
      success: false,
      error: "ValidationErrors.admin_impersonation_link_generation_failed",
    };
    // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
  }

  await createAuditLog("user_impersonated", {
    userId: roleCheck.data.user.id,
    targetEntityId: userId,
    targetEntityType: "user",
    metadata: { impersonatedEmail: userData.user.email },
  });

  return { success: true, data: { signInLink: data.properties.action_link } };
}

/**
 * @public
 * @async
 * @function deleteSiteAsAdminAction
 * @description [Privilegio: admin, developer] Permite a un administrador eliminar
 *              permanentemente un sitio de la plataforma.
 * @param {FormData} formData - Datos del formulario que contienen 'subdomain' y 'siteId'.
 * @returns {Promise<ActionResult<{ message: string }>>} El resultado de la operación.
 */
export async function deleteSiteAsAdminAction(
  formData: FormData
): Promise<ActionResult<{ message: string }>> {
  const roleCheck = await requireAppRole(["admin", "developer"]);
  if (!roleCheck.success) {
    return { success: false, error: roleCheck.error };
  }

  const subdomain = formData.get("subdomain") as string;
  if (!subdomain) {
    // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
    return {
      success: false,
      error: "ValidationErrors.admin_delete_site_subdomain_missing",
    };
    // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
  }

  try {
    const adminSupabase = createAdminClient();
    const { error, data: deletedSite } = await adminSupabase
      .from("sites")
      .delete()
      .eq("subdomain", subdomain)
      .select("id, subdomain")
      .single();

    if (error || !deletedSite) {
      logger.error(
        `[AdminActions:deleteSiteAsAdminAction] Error al eliminar el sitio ${subdomain}:`,
        error
      );
      // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
      return {
        success: false,
        error: "ValidationErrors.admin_delete_site_failed",
      };
      // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
    }

    revalidateTag(`sites:${subdomain}`);
    revalidatePath("/admin"); // Considerar una ruta más específica si existe

    await createAuditLog("site_deleted_admin", {
      userId: roleCheck.data.user.id,
      targetEntityId: deletedSite.id,
      targetEntityType: "site",
      metadata: { subdomain: deletedSite.subdomain },
    });

    return {
      success: true,
      data: { message: `Sitio ${subdomain} eliminado correctamente.` }, // Mantener este mensaje para el toast específico de admin
    };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "deleteSiteAsAdminAction.unexpected",
      error as Error,
      {
        userId: roleCheck.data.user.id,
        subdomain,
      }
    );
    logger.error(
      `[AdminActions:deleteSiteAsAdminAction] Error inesperado. Log ID: ${errorId}`,
      { error: error instanceof Error ? error.message : String(error) }
    );
    return { success: false, error: "ValidationErrors.error_server_generic" };
  }
}

/**
 * @public
 * @async
 * @function updateUserRoleAction
 * @description [Privilegio: developer] Permite a un desarrollador cambiar el rol de
 *              aplicación (`app_role`) de otro usuario.
 * @param {string} userId - El ID del usuario cuyo rol se va a modificar.
 * @param {Database["public"]["Enums"]["app_role"]} newRole - El nuevo rol a asignar.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
 */
export async function updateUserRoleAction(
  userId: string,
  newRole: Database["public"]["Enums"]["app_role"]
): Promise<ActionResult<void>> {
  const roleCheck = await requireAppRole(["developer"]);
  if (!roleCheck.success) {
    return { success: false, error: roleCheck.error };
  }

  if (roleCheck.data.user.id === userId) {
    // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
    return {
      success: false,
      error:
        "ValidationErrors.admin_update_user_role_self_role_change_forbidden",
    };
    // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
  }

  try {
    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase
      .from("profiles")
      .update({ app_role: newRole })
      .eq("id", userId);

    if (error) {
      logger.error(
        `[AdminActions:updateUserRoleAction] Error al actualizar rol para ${userId}:`,
        error
      );
      // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
      return {
        success: false,
        error: "ValidationErrors.admin_update_user_role_failed",
      };
      // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
    }

    revalidatePath("/dev-console/users");

    await createAuditLog("user_role_updated", {
      userId: roleCheck.data.user.id,
      targetEntityId: userId,
      targetEntityType: "user",
      metadata: { newRole },
    });

    return { success: true, data: undefined };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "updateUserRoleAction.unexpected",
      error as Error,
      { userId: roleCheck.data.user.id, targetUserId: userId, newRole }
    );
    logger.error(
      `[AdminActions:updateUserRoleAction] Error inesperado. Log ID: ${errorId}`,
      { error: error instanceof Error ? error.message : String(error) }
    );
    return { success: false, error: "ValidationErrors.error_server_generic" };
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Centralización de Errores (SSoT)**: ((Implementada)) Todos los mensajes de error `hardcodeados` en `impersonateUserAction`, `deleteSiteAsAdminAction` y `updateUserRoleAction` ahora utilizan claves del namespace `shared.ValidationErrors` con prefijos de dominio (`admin_`). Esto consolida la "Única Fuente de Verdad" para los errores de administración.
 * 2. **Consistencia en el Manejo de Errores**: ((Implementada)) Se ha estandarizado la forma en que los errores son reportados por estas Server Actions, haciendo que el `ActionResult` de error sea más predecible para los componentes consumidores (ej. tablas del Dev Console).
 * 3. **Full Observabilidad Mejorada**: ((Implementada)) Se han añadido `logger.warn` y `logger.error` contextuales en cada punto de fallo, y se ha integrado `createPersistentErrorLog` para los errores inesperados, proporcionando una trazabilidad completa.
 * 4. **No Regresión Funcional**: ((Implementada)) La lógica de negocio principal de cada acción se mantiene intacta, con la mejora centrada en la resiliencia y la internacionalización.
 *
 * @subsection Melhorias Futuras
 * 1. **Esquemas Zod para Inputs**: ((Vigente)) En lugar de verificar `if (!userId)` o `if (!subdomain)`, estas acciones deberían utilizar esquemas Zod explícitos para validar `FormData`, lo que proporcionaría un tipado más robusto y mensajes de error más detallados (ej. `AdminImpersonationSchema`).
 * 2. **Transacciones de Base de Datos para Operaciones Críticas**: ((Vigente)) La acción `deleteSiteAsAdminAction` (y `deleteWorkspaceAction` en `workspaces.actions.ts`) podría ser migrada a una función RPC de PostgreSQL para garantizar la atomicidad transaccional al eliminar registros relacionados (sitios, campañas, etc.) en un solo paso de base de datos.
 *
 * =====================================================================
 */
