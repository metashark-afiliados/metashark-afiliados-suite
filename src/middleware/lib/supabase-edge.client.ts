// src/middleware/lib/supabase-edge.client.ts
/**
 * @file src/middleware/lib/supabase-edge.client.ts
 * @description Aparato de utilidad para crear un cliente Supabase de servidor,
 *              optimizado para el Edge Runtime. Ha sido refactorizado para
 *              consumir la nueva factoría de mocks atomizada.
 * @author Raz Podestá
 * @version 4.0.0
 */
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: {
          getItem: (key) => request.cookies.get(key)?.value ?? null,
          setItem: (key, value) => {
            request.cookies.set(key, value);
            response.cookies.set(key, value);
          },
          removeItem: (key) => {
            request.cookies.set(key, "");
            response.cookies.set(key, "");
          },
        },
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
 * 1. **Sincronización Arquitectónica**: ((Implementada)) El aparato ahora importa `createDevMockSupabaseClient` desde la nueva factoría atomizada, completando la refactorización del sistema de mocks.
 *
 * @subsection Melhorias Futuras
 * 1. **Sincronización con `@supabase/ssr`**: ((Vigente)) Monitorear futuras versiones de `@supabase/ssr` que puedan ofrecer una exportación explícita para el Edge Runtime y adoptar esa solución canónica cuando esté disponible.
 *
 * =====================================================================
 */
// src/middleware/lib/supabase-edge.client.ts
