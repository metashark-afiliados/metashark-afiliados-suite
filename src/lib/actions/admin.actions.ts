// src/lib/actions/admin.actions.ts
/**
 * @file src/lib/actions/admin.actions.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              del dominio de administración.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 2.0.0
 * @see .docs-espejo/lib/actions/admin.actions.ts.md
 */
"use server";
import "server-only";

export { impersonateUserAction } from "./admin/impersonateUser.action";
export { updateUserRoleAction } from "./admin/updateUserRole.action";
// La acción `deleteSiteAsAdminAction` se omite intencionalmente para la siguiente fase.
// src/lib/actions/admin.actions.ts
