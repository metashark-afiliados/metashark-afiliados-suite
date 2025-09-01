// src/lib/actions/auth.actions.ts
/**
 * @file src/lib/actions/auth.actions.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              del dominio de autenticación. Ensambla y exporta las acciones atómicas
 *              desde sus módulos soberanos.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 3.0.0
 * @see .docs-espejo/lib/actions/auth.actions.ts.md
 */
"use server";
import "server-only";

export { signInWithEmailAction } from "./auth/signInWithEmail.action";
export { signInWithOAuthAction } from "./auth/signInWithOAuth.action";
export { signUpAction } from "./auth/signUp.action";
// src/lib/actions/auth.actions.ts
