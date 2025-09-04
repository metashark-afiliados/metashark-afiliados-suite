// src/config/roles.config.ts
/**
 * @file roles.config.ts
 * @description Manifiesto de Configuración y SSoT para los roles de workspace.
 *              Este aparato mapea los nombres de rol semánticos a sus
 *              IDs canónicos en la base de datos y provee un toolkit de tipos y
 *              constantes derivadas para su uso seguro en toda la aplicación.
 * @author L.I.A. Legacy
 * @version 1.0.0
 * @see .docs/debt/001_LEAN_DB_ABSTRACTION_LEAK.md
 * @see .docs-espejo/config/roles.config.ts.md
 */
import "server-only";

/**
 * @public
 * @constant WORKSPACE_ROLES
 * @description La SSoT canónica e inmutable que mapea los roles de negocio a su
 *              representación en la base de datos (`workspace_roles` lookup table).
 *              Todos los demás tipos y constantes en este módulo se derivan de este objeto.
 */
export const WORKSPACE_ROLES = {
  OWNER: { id: 1, name: "owner" },
  ADMIN: { id: 2, name: "admin" },
  MEMBER: { id: 3, name: "member" },
  VIEWER: { id: 4, name: "viewer" },
  BILLING: { id: 5, name: "billing" },
} as const;

/**
 * @public
 * @type WorkspaceRoleName
 * @description Un tipo de unión literal que representa todos los nombres de roles de
 *              workspace válidos (ej. "owner" | "admin" | ...).
 *              Derivado automáticamente de `WORKSPACE_ROLES`.
 */
export type WorkspaceRoleName =
  (typeof WORKSPACE_ROLES)[keyof typeof WORKSPACE_ROLES]["name"];

/**
 * @public
 * @type WorkspaceRoleId
 * @description Un tipo de unión literal que representa todos los IDs de roles de
 *              workspace válidos (ej. 1 | 2 | 3 | ...).
 *              Derivado automáticamente de `WORKSPACE_ROLES`.
 */
export type WorkspaceRoleId =
  (typeof WORKSPACE_ROLES)[keyof typeof WORKSPACE_ROLES]["id"];

/**
 * @public
 * @constant WORKSPACE_ROLE_IDS
 * @description Un array de solo lectura que contiene todos los IDs de roles válidos.
 *              Útil para la lógica de validación de permisos.
 */
export const WORKSPACE_ROLE_IDS = Object.values(WORKSPACE_ROLES).map(
  (role) => role.id
) as [WorkspaceRoleId, ...WorkspaceRoleId[]];

/**
 * @public
 * @constant WORKSPACE_ROLE_NAMES
 * @description Un array de solo lectura que contiene todos los nombres de roles válidos.
 */
export const WORKSPACE_ROLE_NAMES = Object.values(WORKSPACE_ROLES).map(
  (role) => role.name
) as [WorkspaceRoleName, ...WorkspaceRoleName[]];

/**
 * @public
 * @constant WORKSPACE_ROLE_LIST
 * @description Un array de solo lectura que contiene todos los objetos de rol completos.
 *              Ideal para poblar elementos de UI como menús desplegables.
 */
export const WORKSPACE_ROLE_LIST = Object.values(WORKSPACE_ROLES);
// src/config/roles.config.ts
