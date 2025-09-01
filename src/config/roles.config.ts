// src/config/roles.config.ts
/**
 * @file roles.config.ts
 * @description Manifiesto de Configuración y SSoT para los roles de workspace.
 *              Este aparato mapea los nombres de rol semánticos a sus IDs
 *              canónicos en la base de datos, eliminando "números mágicos" y
 *              centralizando la lógica de roles.
 * @author L.I.A. Legacy
 * @copilot RaZ WriTe
 * @version 1.0.0
 */
export const WORKSPACE_ROLES = {
  OWNER: { id: 1, name: "owner" },
  ADMIN: { id: 2, name: "admin" },
  MEMBER: { id: 3, name: "member" },
  VIEWER: { id: 4, name: "viewer" },
  BILLING: { id: 5, name: "billing" },
} as const;

export type WorkspaceRoleName =
  (typeof WORKSPACE_ROLES)[keyof typeof WORKSPACE_ROLES]["name"];

// src/config/roles.config.ts
