// src/lib/actions/password.actions.ts
/**
 * @file password.actions.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              del dominio de gestión de contraseñas. Ensambla y exporta las
 *              acciones atómicas desde sus módulos soberanos.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/password.actions.ts.md
 */
"use server";
import "server-only";

export { requestPasswordResetAction } from "./password/requestPasswordReset.action";
export { updatePasswordAction } from "./password/updatePassword.action";
// src/lib/actions/password.actions.ts
