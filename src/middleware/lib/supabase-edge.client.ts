// src/middleware/lib/supabase-edge.client.ts
/**
 * @file src/middleware/lib/supabase-edge.client.ts
 * @description Aparato de utilidad para crear un cliente Supabase de servidor,
 *              optimizado para el Vercel Edge Runtime. Ha sido refactorizado para
 *              deshabilitar la persistencia de sesión, resolviendo una
 *              incompatibilidad crítica con el Edge Runtime.
 * @author Raz Podestá
 * @version 6.0.0
 */
import "server-only";

import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

import { createDevMockSupabaseClient } from "@/lib/supabase/mock-client-factory";
import { logger } from "@/lib/logging";
import { type Database } from "@/lib/types/database";

const isDevMode =
  process.env.NODE_ENV === "development" &&
  process.env.DEV_MODE_ENABLED === "true";

/**
 * @public
 * @function createEdgeClient
 * @description Factoría para crear una instancia del cliente Supabase para el Middleware.
 *              En `DEV_MODE`, devuelve una instancia simulada.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @param {NextResponse} response - El objeto de la respuesta para establecer cookies.
 * @returns {import('@supabase/supabase-js').SupabaseClient<Database>}
 */
export function createEdgeClient(request: NextRequest, response: NextResponse) {
  if (isDevMode) {
    logger.warn(
      "🚧 [EDGE] Modo Desarrollador ACTIVO. Devolviendo cliente Supabase SIMULADO."
    );
    return createDevMockSupabaseClient(
      request.cookies
    ) as import("@supabase/supabase-js").SupabaseClient<Database>;
  }

  logger.trace(
    "[SupabaseEdgeClient] Creando instancia de cliente REAL para el Edge."
  );

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response.cookies.set({ name, value: "", ...options });
        },
      },
      // --- INICIO DE CORRECCIÓN CRÍTICA DE RUNTIME ---
      // Se deshabilita explícitamente la persistencia de sesión y el auto-refresco.
      // Esto instruye a la librería @supabase/ssr a no utilizar la lógica
      // que depende de APIs de Node.js (como `process`), resolviendo el error de build.
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      // --- FIN DE CORRECCIÓN CRÍTICA DE RUNTIME ---
    }
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Compatibilidad con Vercel Edge**: ((Implementada)) Se han añadido las opciones `autoRefreshToken: false` y `persistSession: false`. Esta es la solución canónica recomendada por Supabase para ejecutar el cliente en entornos restringidos como el Edge Runtime, eliminando la dependencia de APIs de Node.js y resolviendo el error crítico de build.
 * 2. **Cero Regresiones**: ((Implementada)) La lógica de manejo de cookies y la integración con el modo de desarrollo simulado se han preservado intactas.
 *
 * @subsection Melhorias Futuras
 * 1. **Sincronización de Versiones**: ((Vigente)) Monitorear futuras versiones de `@supabase/ssr` que puedan ofrecer una exportación explícita para el Edge Runtime (ej. `createEdgeServerClient`) y adoptar esa solución canónica cuando esté disponible para una mayor claridad semántica.
 *
 * =====================================================================
 */
// src/middleware/lib/supabase-edge.client.ts
