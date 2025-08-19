// src/middleware/lib/supabase-edge.client.ts
/**
 * @file src/middleware/lib/supabase-edge.client.ts
 * @description Aparato de utilidad atómico y aislado para crear un cliente Supabase
 *              de servidor, optimizado para el Vercel Edge Runtime. Ha sido corregido
 *              para utilizar la firma de API correcta para la manipulación de
 *              `request.cookies`, resolviendo una regresión crítica de tipos.
 * @author L.I.A. Legacy
 * @version 6.1.0
 */
import "server-only";

import { type NextRequest, type NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

import { createDevMockSupabaseClient } from "@/lib/supabase/mock-client-factory";
import { logger } from "@/lib/logging";
import { type Database } from "@/lib/types/database";

const isDevMode =
  process.env.NODE_ENV === "development" &&
  process.env.DEV_MODE_ENABLED === "true";

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
        // --- INICIO DE CORRECCIÓN DE CONTRATO DE API ---
        // La API `request.cookies.set` y `response.cookies.set` esperan un único objeto.
        // Se construye el objeto a partir de los argumentos proporcionados por Supabase.
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
        // --- FIN DE CORRECCIÓN DE CONTRATO DE API ---
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
 * 1. **Resolución de Regresión Crítica (TS2345)**: ((Implementada)) Se ha corregido la implementación de los callbacks `set` y `remove` para que construyan un único objeto de cookie, alineándose con la API de `RequestCookies` de `next/server` y resolviendo la causa raíz del error de compilación.
 *
 * =====================================================================
 */
// src/middleware/lib/supabase-edge.client.ts
