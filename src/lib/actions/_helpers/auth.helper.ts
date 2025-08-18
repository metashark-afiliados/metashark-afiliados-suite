// src/lib/actions/_helpers/auth.helper.ts
/**
 * @file auth.helper.ts
 * @description Helper atómico y reutilizable para obtener la sesión del usuario
 *              autenticado dentro de las Server Actions. Es la SSoT para la
 *              validación de sesión.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use server";
import "server-only";

import { type User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import { type ActionResult } from "@/lib/validators";

/**
 * @public
 * @async
 * @function getAuthenticatedUser
 * @description Obtiene el usuario autenticado de la sesión actual.
 * @returns {Promise<{ user: User } | { error: ActionResult<never> }>} Un objeto
 *          conteniendo el usuario si tiene éxito, o un objeto de error si no.
 */
export async function getAuthenticatedUser(): Promise<
  { user: User } | { error: ActionResult<never> }
> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: { success: false, error: "error_unauthenticated" } };
  }
  return { user };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad (SRP)**: ((Implementada)) Este nuevo aparato tiene la única responsabilidad de obtener y validar la sesión de un usuario.
 *
 * =====================================================================
 */
// src/lib/actions/_helpers/auth.helper.ts