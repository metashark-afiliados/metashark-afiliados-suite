// src/lib/actions/_helpers/auth.helper.ts
/**
 * @file auth.helper.ts
 * @description Helper atómico para obtener la sesión. Restaurado a su estado
 *              de producción, eliminando el bypass de desarrollo global.
 * @author Raz Podestá
 * @version 3.0.0 (Production Ready)
 */
"use server";
import "server-only";

import { type User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import { type ActionResult } from "@/lib/validators";
import { logger } from "@/lib/logging";

/**
 * @public
 * @async
 * @function getAuthenticatedUser
 * @description Obtiene el usuario autenticado de la sesión de Supabase.
 * @returns {Promise<{ user: User } | { error: ActionResult<never> }>}
 */
export async function getAuthenticatedUser(): Promise<
  { user: User } | { error: ActionResult<never> }
> {
  logger.trace("[AuthHelper] Buscando sesión de usuario real en Supabase...");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("[AuthHelper] No se encontró una sesión de usuario válida.");
    return { error: { success: false, error: "error_unauthenticated" } };
  }

  logger.trace("[AuthHelper] Sesión de usuario real encontrada.", {
    userId: user.id,
  });
  return { user };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Seguridad Restaurada**: ((Implementada)) Se ha eliminado el bypass global. El helper ahora siempre realiza una comprobación de autenticación real, haciendo que la base de código sea más segura por defecto.
 *
 * =====================================================================
 */
// src/lib/actions/_helpers/auth.helper.ts
