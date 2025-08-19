// src/middleware/lib/supabase-edge.client.ts
/**
 * @file src/middleware/lib/supabase-edge.client.ts
 * @description Aparato de utilidad para crear un cliente Supabase de servidor,
 *              optimizado para el Vercel Edge Runtime. Ha sido corregido para
 *              utilizar la firma de API correcta para la manipulación de
 *              `request.cookies`, resolviendo una regresión crítica de tipos.
 * @author Raz Podestá
 * @version 6.2.0
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
        // --- INICIO DE CORRECCIÓN DEFINITIVA DE API ---
        // La API `request.cookies.set` espera un único objeto.
        // Se construye el objeto a partir de los argumentos proporcionados por Supabase.
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response.cookies.set({ name, value: "", ...options });
        },
        // --- FIN DE CORRECCIÓN DEFINITIVA DE API ---
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
 * 1. **Resolución de Regresión Crítica Definitiva**: ((Implementada)) Se ha corregido la implementación de `set` y `remove` para que construyan un único objeto, alineándose con la API de `RequestCookies` de `next/server` y resolviendo la cascada de errores de TypeScript de forma canónica.
 *
 * =====================================================================
 */
// src/middleware/lib/supabase-edge.client.ts
