// src/lib/actions/admin/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              del dominio de administración. Este es el punto de entrada
 *              canónico para consumir todas las acciones de alto privilegio.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

export { impersonateUserAction } from "./impersonateUser.action";

export { updateUserRoleAction } from "./updateUserRole.action";
// src/lib/actions/admin/index.ts
