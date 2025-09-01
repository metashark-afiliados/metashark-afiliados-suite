// src/lib/data/permissions.ts
/**
 * @file src/lib/data/permissions.ts
 * @description Módulo de bajo nivel y SSoT para la lógica de autorización.
 *              Sincronizado con la arquitectura "Lean Database" para consultar
 *              `role_id` y consumir el manifiesto de roles.
 * @author L.I.A. Legacy
 * @copilot RaZ WriTe
 * @version 3.0.0
 * @see .docs-espejo/lib/data/permissions.ts.md
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";

import { WORKSPACE_ROLES, type WorkspaceRoleName } from "@/config/roles.config";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

/**
 * @public
 * @async
 * @function hasWorkspacePermission
 * @description Verifica si un usuario tiene uno de los roles requeridos en un workspace específico.
 * @param {string} userId - El UUID del usuario a verificar.
 * @param {string} workspaceId - El UUID del workspace en el que se requiere el permiso.
 * @param {WorkspaceRoleName[]} requiredRoles - Un array de nombres de rol semánticos.
 * @returns {Promise<boolean>} Devuelve `true` si el usuario tiene el permiso, `false` en caso contrario.
 */
export const hasWorkspacePermission = cache(
  async (
    userId: string,
    workspaceId: string,
    requiredRoles: WorkspaceRoleName[]
  ): Promise<boolean> => {
    logger.trace(
      { userId, workspaceId, requiredRoles },
      `[AuthPermissions:Cache MISS] Verificando permisos de workspace.`
    );

    const requiredRoleIds = requiredRoles
      .map(
        (roleName) =>
          Object.values(WORKSPACE_ROLES).find((r) => r.name === roleName)?.id
      )
      .filter(Boolean) as number[];

    if (requiredRoleIds.length === 0) {
      logger.warn(
        { requiredRoles },
        "[AuthPermissions] No se proporcionaron roles válidos para la verificación."
      );
      return false;
    }

    const supabase = createClient();
    const { data: member, error } = await supabase
      .from("workspace_members")
      .select("role_id")
      .eq("user_id", userId)
      .eq("workspace_id", workspaceId)
      .single();

    if (error || !member) {
      if (error && error.code !== "PGRST116") {
        logger.error(
          { error },
          `[AuthPermissions] Error al verificar permisos para usuario ${userId} en workspace ${workspaceId}.`
        );
      }
      return false;
    }

    const hasPermission = requiredRoleIds.includes(member.role_id);
    logger.trace(
      {
        userId,
        workspaceId,
        userRoleId: member.role_id,
        requiredRoleIds,
        hasPermission,
      },
      `[AuthPermissions] Resultado de la verificación.`
    );
    return hasPermission;
  },
  ["workspace_permissions"],
  {
    tags: ["permissions"],
  }
);
// src/lib/data/permissions.ts
