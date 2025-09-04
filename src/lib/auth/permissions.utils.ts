// src/lib/auth/permissions.utils.ts
/**
 * @file permissions.utils.ts
 * @description Aparato de utilidad para la lógica de permisos basada en nombres.
 *              ADVERTENCIA: Este módulo es un contenedor de deuda técnica
 *              y está destinado a ser deprecado.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 * @see .docs/debt/001_LEAN_DB_ABSTRACTION_LEAK.md
 */
"use client";

import { type WorkspaceRoleName } from "@/config/roles.config";
import { clientLogger } from "@/lib/logger";

/**
 * @public
 * @function hasPermissionByName
 * @description [CONTENEDOR DE DEUDA TÉCNICA] Verifica si un rol de usuario
 *              (por nombre) está incluido en una lista de roles requeridos.
 *              Esta función debe ser reemplazada por una lógica que compare
 *              IDs de rol numéricos.
 * @param {WorkspaceRoleName | null} userRole - El nombre del rol del usuario actual.
 * @param {WorkspaceRoleName[]} requiredRoles - Un array de nombres de roles que otorgan el permiso.
 * @returns {boolean} `true` si el usuario tiene el permiso, `false` en caso contrario.
 */
export function hasPermissionByName(
  userRole: WorkspaceRoleName | null,
  requiredRoles: WorkspaceRoleName[]
): boolean {
  if (!userRole) {
    return false;
  }
  const hasAccess = requiredRoles.includes(userRole);

  clientLogger.trace("[PermissionsCheck:ByName]", {
    userRole,
    requiredRoles,
    hasAccess,
  });

  return hasAccess;
}
// src/lib/auth/permissions.utils.ts
