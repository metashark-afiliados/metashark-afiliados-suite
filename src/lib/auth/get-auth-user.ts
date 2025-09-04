// src/lib/auth/get-auth-user.ts
/**
 * @file get-auth-user.ts
 * @description Aparato de servidor atómico y SSoT para obtener la sesión del
 *              usuario autenticado de forma segura y observable. Refactorizado
 *              para cumplir con la firma de logging canónica de la Constitución.
 * @author RaZ Podestá - MetaShark Tech
 * @version 3.0.0
 */
"use server";
import "server-only";

import { type User } from "@supabase/supabase-js";

import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

/**
 * @public
 * @async
 * @function getAuthUser
 * @description Obtiene el usuario autenticado de la sesión de Supabase.
 *              Es la SSoT para la recuperación de la sesión en el servidor.
 * @returns {Promise<User | null>} El objeto de usuario de Supabase si la sesión
 *          es válida, o `null` si no hay sesión activa.
 * @throws {Error} Si ocurre un error inesperado durante la comunicación con
 *         Supabase, el error se registra y se vuelve a lanzar para ser
 *         manejado por las capas superiores.
 */
export async function getAuthUser(): Promise<User | null> {
  logger.trace(
    {},
    "[getAuthUser] Iniciando recuperación de sesión de usuario."
  );
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    if (!user) {
      logger.info(
        {},
        "[getAuthUser] No se encontró una sesión de usuario activa."
      );
      return null;
    }

    logger.info(
      { userId: user.id },
      "[getAuthUser] Sesión de usuario obtenida con éxito."
    );
    return user;
  } catch (error) {
    logger.error(
      { err: error },
      "[getAuthUser] Error inesperado al recuperar la sesión del usuario."
    );
    throw error;
  }
}
// src/lib/auth/get-auth-user.ts
