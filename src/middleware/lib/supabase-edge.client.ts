// src/middleware/lib/supabase-edge.client.ts
/**
 * @file src/middleware/lib/supabase-edge.client.ts
 * @description Aparato de utilidad para crear un cliente Supabase para el Edge.
 *              Ha sido refactorizado para "Producción Total", eliminando la
 *              lógica de `DEV_MODE` para interactuar siempre con la base de
 *              datos remota real desde el Edge Runtime.
 * @author L.I.A. Legacy
 * @version 11.0.0
 */
import "server-only";

import { type NextRequest, type NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { logger } from "@/lib/logging";
import { type Database } from "@/lib/types/database";

/**
 * @public
 * @async
 * @function createEdgeClient
 * @description Factoría para crear una instancia del cliente de Supabase dentro del Middleware.
 *              Esta función es la única forma canónica de interactuar con Supabase en el
 *              Edge Runtime de manera segura y con estado.
 * @param {NextRequest} request - El objeto de la petición entrante, del cual se leen las cookies.
 * @param {NextResponse} response - La respuesta, que será modificada con las cookies de sesión.
 * @returns {Promise<import('@supabase/supabase-js').SupabaseClient<Database>>}
 *          Una promesa que resuelve con la instancia del cliente Supabase, fuertemente
 *          tipada contra el esquema completo de la base de datos.
 */
export async function createEdgeClient(
  request: NextRequest,
  response: NextResponse
) {
  logger.trace(
    "[SupabaseEdgeClient] Creando instancia de cliente REAL para el Edge."
  );

  return createServerClient<Database>(
    process.env.INTEGRATION_NEXT_PUBLIC_SUPABASE_URL!,
    process.env.INTEGRATION_NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Orientado a Producción**: ((Implementada)) Se ha eliminado toda la lógica de `DEV_MODE` y el mock en memoria. Este aparato ahora es una factoría de cliente de producción pura para el Edge.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Errores de Conexión**: ((Vigente)) Se podría envolver la creación del cliente en un `try/catch` para manejar posibles errores si las variables de entorno no están disponibles, aunque Vercel normalmente falla el build en ese caso.
 *
 * =====================================================================
 */
