// src/lib/supabase/middleware.ts
/**
 * @file src/lib/supabase/middleware.ts
 * @description Aparato de utilidad para la creación de un cliente Supabase de servidor,
 *              específicamente diseñado para el entorno de Middleware de Next.js (Edge Runtime).
 *              Ha sido refactorizado holísticamente para incluir validación de formato
 *              estricta para la URL de Supabase, un helper para la creación de respuestas
 *              encadenadas, observabilidad de cookies enriquecida y tipado estricto.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type NextRequest, NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { logger } from "@/lib/logging";
import { type Database } from "@/lib/types/database";

type CanonicalCookieName =
  | "active_workspace_id"
  | "metashark_session_id"
  | "NEXT_LOCALE"
  | "NEXT_LOCALE_CHOSEN"
  | "DEBUG_LOCALE"
  | `sb-${string}-auth-token`
  | "sb-csrf";

/**
 * @private
 * @function createChainedResponse
 * @description Helper atómico que crea un nuevo objeto NextResponse para el encadenamiento
 *              seguro de modificaciones en el pipeline del middleware.
 * @param {NextRequest} request - El objeto de la petición actual.
 * @returns {NextResponse} Un nuevo objeto de respuesta.
 */
function createChainedResponse(request: NextRequest): NextResponse {
  return NextResponse.next({
    request: { headers: request.headers },
  });
}

/**
 * @private
 * @function getEdgeCookieHandlers
 * @description Helper atómico que crea los manejadores de cookies para el cliente
 *              Supabase en el Edge Runtime.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @param {(newResponse: NextResponse) => void} updateResponseCallback - Un callback para
 *        actualizar la referencia a la respuesta cuando una cookie es modificada.
 * @returns {import('@supabase/ssr').CookieMethods} Los métodos para la gestión de cookies.
 */
function getEdgeCookieHandlers(
  request: NextRequest,
  updateResponseCallback: (newResponse: NextResponse) => void
): {
  get: (name: string) => string | undefined;
  set: (name: string, value: string, options: CookieOptions) => void;
  remove: (name: string, options: CookieOptions) => void;
} {
  return {
    get(name: CanonicalCookieName | string) {
      return request.cookies.get(name)?.value;
    },
    set(
      name: CanonicalCookieName | string,
      value: string,
      options: CookieOptions
    ) {
      logger.trace(
        `[SupabaseMiddlewareClient:CookieHandler] Estableciendo cookie: ${name}`,
        { options }
      );
      try {
        request.cookies.set({ name, value, ...options });
        const newResponse = createChainedResponse(request);
        newResponse.cookies.set({ name, value, ...options });
        updateResponseCallback(newResponse);
      } catch (error) {
        logger.error(
          `[SupabaseMiddlewareClient:CookieHandler] Fallo al establecer cookie: ${name}`,
          error
        );
      }
    },
    remove(name: CanonicalCookieName | string, options: CookieOptions) {
      logger.trace(
        `[SupabaseMiddlewareClient:CookieHandler] Eliminando cookie: ${name}`,
        { options }
      );
      try {
        request.cookies.set({ name, value: "", ...options });
        const newResponse = createChainedResponse(request);
        newResponse.cookies.set({ name, value: "", ...options });
        updateResponseCallback(newResponse);
      } catch (error) {
        logger.error(
          `[SupabaseMiddlewareClient:CookieHandler] Fallo al eliminar cookie: ${name}`,
          error
        );
      }
    },
  };
}

/**
 * @public
 * @function createClient
 * @description Factoría para crear una instancia del cliente de Supabase dentro del Middleware.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @param {NextResponse} [initialResponse] - Un objeto de respuesta opcional para encadenar modificaciones.
 * @returns {{ supabase: import('@supabase/supabase-js').SupabaseClient<Database>; response: NextResponse; }} Un objeto que contiene
 *          la instancia del cliente Supabase y el objeto de respuesta actualizado.
 * @throws {Error} Si las variables de entorno de Supabase no están configuradas o son inválidas.
 */
export function createClient(
  request: NextRequest,
  initialResponse?: NextResponse
) {
  logger.trace(
    "[SupabaseMiddlewareClient] Iniciando creación de cliente Edge-safe..."
  );

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    logger.error(
      "[SupabaseMiddlewareClient] Error Crítico: Las variables de entorno de Supabase no están definidas."
    );
    throw new Error(
      "Configuración de Supabase incompleta en el entorno del servidor."
    );
  }

  const supabaseDomainRegex = /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/;
  if (!supabaseDomainRegex.test(supabaseUrl)) {
    logger.error(
      `[SupabaseMiddlewareClient] Error Crítico: La URL de Supabase es inválida o no sigue el patrón esperado: ${supabaseUrl}`
    );
    throw new Error(
      "La variable de entorno NEXT_PUBLIC_SUPABASE_URL no es una URL de Supabase válida."
    );
  }

  let response = initialResponse || createChainedResponse(request);

  const updateResponse = (newResponse: NextResponse) => {
    response = newResponse;
  };

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: getEdgeCookieHandlers(request, updateResponse),
  });

  return { supabase, response };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Centralización de Configuración de Regex**: La expresión regular para validar la URL de Supabase podría ser definida en un manifiesto de configuración central (`src/config/regex.config.ts`) para su reutilización en otras partes de la aplicación que necesiten validaciones similares.
 * 2. **Tipado de Errores de Cookie**: Los bloques `catch` en los manejadores de cookies podrían ser mejorados para usar un guardián de tipo que verifique si el `error` es una instancia de `TypeError` (común en operaciones de headers inmutables), permitiendo un logging más específico y contextual.
 * 3. **Gestión de Sesiones Múltiples**: Si la aplicación soportara múltiples sesiones de usuario simultáneamente (ej. cuentas de administrador y usuario), el `CanonicalCookieName` podría ser extendido para manejar cookies de sesión con prefijos específicos por rol.
 * =====================================================================
 */
// src/lib/supabase/middleware.ts
