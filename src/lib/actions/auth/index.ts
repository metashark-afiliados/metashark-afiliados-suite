// src/lib/actions/auth/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              del dominio de autenticación. Este es el punto de entrada
 *              canónico para consumir todas las acciones del ciclo de vida
 *              de autenticación del usuario.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

export { signInWithEmailAction } from "./signInWithEmail.action";
export { signInWithOAuthAction } from "./signInWithOAuth.action";
export { signUpAction } from "./signUp.action";
// src/lib/actions/auth/index.ts
