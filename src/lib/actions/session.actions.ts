// src/lib/actions/session.actions.ts
/**
 * @file session.actions.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              del dominio de gestión de sesión. Ensambla y exporta las
 *              acciones atómicas desde sus módulos soberanos.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/session.actions.ts.md
 */
"use server";
import "server-only";

export { signOutAction } from "./session/signOut.action";
// src/lib/actions/session.actions.ts
