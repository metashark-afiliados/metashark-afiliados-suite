// src/lib/auth/permissions.ts
/**
 * @file src/lib/auth/permissions.ts
 * @description Módulo de bajo nivel y SSoT para la lógica de autorización.
 *              Sincronizado con la arquitectura "Lean Database" (AD-002) y
 *              corregido para manejar correctamente la estructura de datos
 *              devuelta por los JOINs de Supabase.
 * @author L.I.A. Legacy
 * @version 2.1.0
 */
"use server";
import "server-only";

import { type WorkspaceRoleName } from "@/config/roles.config";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

/**
 * @public
 * @async
 * @function hasWorkspacePermission
 * @description Verifica si un usuario tiene uno de los roles requeridos en un workspace.
 * @param {string} userId - El UUID del usuario.
 * @param {string} workspaceId - El UUID del workspace.
 * @param {WorkspaceRoleName[]} requiredRoles - Array de nombres de roles requeridos.
 * @returns {Promise<boolean>} `true` si el usuario tiene el permiso, `false` en caso contrario.
 */
export async function hasWorkspacePermission(
  userId: string,
  workspaceId: string,
  requiredRoles: WorkspaceRoleName[]
): Promise<boolean> {
  const supabase = createClient();
  const context = { userId, workspaceId, requiredRoles };

  try {
    const { data: member, error } = await supabase
      .from("workspace_members")
      .select(`workspace_roles (name)`)
      .eq("user_id", userId)
      .eq("workspace_id", workspaceId)
      .single();

    if (error) {
      if (error.code !== "PGRST116") {
        throw error;
      }
      return false; // No es miembro, no hay permisos.
    }

    // --- INICIO DE CORRECCIÓN: Manejo de estructura de JOIN ---
    const roleObject = member?.workspace_roles;
    if (
      !roleObject ||
      typeof roleObject !== "object" ||
      "length" in roleObject
    ) {
      logger.warn(
        context,
        "[AuthPermissions] El miembro no tiene un rol válido (objeto de rol inválido)."
      );
      return false;
    }
    const roleName = (roleObject as { name: string }).name;
    // --- FIN DE CORRECCIÓN ---

    if (!roleName) {
      logger.warn(
        context,
        "[AuthPermissions] El miembro no tiene un rol válido (nombre de rol nulo)."
      );
      return false;
    }

    const hasPermission = requiredRoles.includes(roleName as WorkspaceRoleName);
    logger.trace(
      { ...context, roleName, hasPermission },
      "[AuthPermissions] Verificación completa."
    );
    return hasPermission;
  } catch (error) {
    logger.error(
      { err: error, ...context },
      "[AuthPermissions] Error al verificar permisos."
    );
    return false; // Fail-closed: si hay un error, denegar el acceso.
  }
}
// src/lib/auth/permissions.ts
