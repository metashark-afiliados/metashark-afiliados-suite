// src/lib/actions/_helpers/auth.helper.ts
/**
 * @file Provee helpers atómicos y soberanos para la gestión de autenticación.
 *       Este aparato es autónomo y no requiere inyección de dependencias.
 * @author Raz Podesta - MetaShark Tech
 * @version 3.0.0
 * Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { type User } from "@supabase/supabase-js";

import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type ValidationErrorKey } from "@/lib/validators";

type AuthResultSuccess = {
  success: true;
  data: { user: User };
};

type AuthResultError = {
  success: false;
  error: ValidationErrorKey;
  data: null;
};

export type AuthResult = AuthResultSuccess | AuthResultError;

export class AuthenticationError extends Error {
  public readonly code: ValidationErrorKey;

  constructor(
    message: string = "User is not authenticated.",
    code: ValidationErrorKey = "generic.error_unauthenticated"
  ) {
    super(message);
    this.name = "AuthenticationError";
    this.code = code;
  }
}

/**
 * @public
 * @async
 * @function getAuthenticatedUser
 * @description Obtiene el usuario autenticado. No requiere inyección de cliente.
 * @returns {Promise<AuthResult>} Un objeto `AuthResult`.
 */
export async function getAuthenticatedUser(): Promise<AuthResult> {
  logger.trace({}, "Verificando sesión de usuario autenticado.");
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    logger.warn({ err: error }, "Fallo en la verificación de autenticación.");
    return {
      success: false,
      error: "generic.error_unauthenticated",
      data: null,
    };
  }

  return { success: true, data: { user } };
}

/**
 * @public
 * @async
 * @function getAuthenticatedUserOrThrow
 * @description Obtiene el usuario autenticado o lanza un `AuthenticationError`.
 * @returns {Promise<User>} El objeto `User` si está autenticado.
 * @throws {AuthenticationError} Si el usuario no está autenticado.
 */
export async function getAuthenticatedUserOrThrow(): Promise<User> {
  const authResult = await getAuthenticatedUser();

  if (!authResult.success) {
    throw new AuthenticationError();
  }

  return authResult.data.user;
}
// src/lib/actions/_helpers/auth.helper.ts
