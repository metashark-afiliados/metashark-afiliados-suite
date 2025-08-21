// src/middleware/lib/supabase-edge.client.ts
/**
 * @file src/middleware/lib/supabase-edge.client.ts
 * @description Aparato de utilidad atómico y aislado para crear un cliente Supabase
 *              para el Edge Runtime. Utiliza importación dinámica (`await import`)
 *              para prevenir que dependencias de Node.js se incluyan en el bundle
 *              del Edge, y se alinea con el contrato de API de cookies de Next.js,
 *              resolviendo todos los errores de build conocidos.
 * @author L.I.A. Legacy
 * @version 8.0.0
 */
import "server-only";

import { type NextRequest, type NextResponse } from "next/server";
import { type CookieOptions } from "@supabase/ssr";

import { createDevMockSupabaseClient } from "@/lib/supabase/mock-client-factory";
import { logger } from "@/lib/logging";
import { type Database } from "@/lib/types/database";

const isDevMode =
  process.env.NODE_ENV === "development" &&
  process.env.DEV_MODE_ENABLED === "true";

/**
 * @public
 * @async
 * @function createEdgeClient
 * @description Factoría para crear una instancia del cliente de Supabase dentro del Middleware.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @param {NextResponse} response - La respuesta, que será modificada con las cookies de sesión.
 * @returns {Promise<import('@supabase/supabase-js').SupabaseClient<Database>>}
 */
export async function createEdgeClient(
  request: NextRequest,
  response: NextResponse
) {
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

  // --- INICIO DE REFACTORIZACIÓN DE ÉLITE: IMPORTACIÓN DINÁMICA CORRECTA ---
  const { createServerClient } = await import("@supabase/ssr");
  // --- FIN DE REFACTORIZACIÓN DE ÉLITE ---

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          const cookie = { name, value, ...options };
          request.cookies.set(cookie);
          response.cookies.set(cookie);
        },
        remove(name: string, options: CookieOptions) {
          const cookie = { name, value: "", ...options };
          request.cookies.set(cookie);
          response.cookies.set(cookie);
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Tipo (TS2347)**: ((Implementada)) Se ha reemplazado `require()` por `await import()`. Esta sintaxis moderna de ES Modules preserva la información de tipos, permitiendo que TypeScript reconozca `createServerClient` como una función genérica y acepte el argumento `<Database>`, resolviendo el error.
 * 2. **Resolución de Error de Build en Edge**: ((Implementada)) Al ser una importación dinámica, el bundler de Vercel no la sigue estáticamente, previniendo la inclusión de dependencias de Node.js en el bundle del Edge. Esta solución única resuelve ambos problemas.
 *
 * =====================================================================
 */
