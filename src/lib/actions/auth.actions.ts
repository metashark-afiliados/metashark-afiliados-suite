// src/lib/actions/auth.actions.ts
/**
 * @file src/lib/actions/auth.actions.ts
 * @description Contiene las Server Actions para el flujo de autenticación.
 *              Ha sido nivelado para la arquitectura de UI delegada a Supabase.
 *              Su única responsabilidad es manejar flujos que requieren una
 *              intervención del servidor, como el inicio de sesión con OAuth.
 * @author Raz Podestá
 * @version 3.0.0
 */
"use server";
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { type Provider } from "@supabase/supabase-js";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult } from "@/lib/validators";

/**
 * @public
 * @async
 * @function signInWithOAuthAction
 * @description Inicia el flujo de inicio de sesión con un proveedor OAuth.
 *              Esta acción es invocada por la UI de Supabase cuando el usuario
 *              hace clic en un botón de proveedor (ej. Google, Apple).
 * @param {FormData} formData - Datos del formulario que deben contener la clave 'provider'.
 * @returns {Promise<ActionResult<never> | void>} Redirige al usuario a la página de
 *          consentimiento del proveedor OAuth o devuelve un objeto de error
 *          con una clave de internacionalización.
 */
export async function signInWithOAuthAction(
  formData: FormData
): Promise<ActionResult<never> | void> {
  const provider = formData.get("provider") as Provider | null;
  if (!provider) {
    return { success: false, error: "error_oauth_provider_missing" };
  }

  const supabase = createClient();
  const origin = headers().get("origin");

  logger.trace(
    `[AuthActions] Iniciando flujo OAuth para el proveedor: ${provider}`
  );

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error) {
    logger.error(`[AuthActions] Error al iniciar OAuth con ${provider}`, error);
    await createPersistentErrorLog("signInWithOAuthAction", error, {
      provider,
    });
    return { success: false, error: "error_oauth_failed" };
  }

  return redirect(data.url);
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación Arquitectónica**: ((Implementada)) El aparato ha sido refactorizado para eliminar la lógica de autenticación por contraseña, ahora obsoleta, y enfocarse únicamente en el flujo OAuth requerido por la nueva UI de Supabase. Esto resuelve los errores de compilación `TS2305`.
 * 2. **Full Internacionalización**: ((Implementada)) Los mensajes de error ahora son claves de i18n, cumpliendo con el protocolo de élite.
 * 3. **Full Observabilidad**: ((Implementada)) Se ha mantenido y verificado el logging de errores para una visibilidad total de los fallos en el flujo OAuth, y se ha integrado el registro de errores persistente en la base de datos.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de `redirect_to` Dinámico**: ((Vigente)) La acción podría aceptar un parámetro opcional `redirectTo` en el `FormData` para redirigir al usuario a una página específica después del callback de OAuth, similar a la lógica del parámetro `next`.
 * 2. **Alcances (Scopes) de OAuth Configurables**: ((Vigente)) La acción podría aceptar una prop `scopes` para solicitar permisos adicionales al proveedor OAuth, útil para futuras integraciones.
 *
 * =====================================================================
 */
// src/lib/actions/auth.actions.ts
