// src/middleware/lib/supabase-edge.client.ts
import "server-only";

import { type NextRequest, type NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { type Database } from "@/lib/types/database";

/**
 * @public
 * @async
 * @function createEdgeClient
 * @description Factoría para crear una instancia del cliente Supabase para el Edge Runtime.
 *              Implementa la estrategia de fallback en cascada para las variables de entorno,
 *              garantizando la funcionalidad tanto en Vercel como en desarrollo local.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @param {NextResponse} response - El objeto de la respuesta para establecer cookies.
 * @returns {Promise<import('@supabase/supabase-js').SupabaseClient<Database>>} Un cliente Supabase para el Edge.
 * @author Raz Podestá
 * @version 12.0.0
 */
export async function createEdgeClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient<Database>(
    process.env.INTEGRATION_NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.INTEGRATION_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
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
 * 1. **Resiliencia de Entorno**: ((Implementada)) La factoría ahora es agnóstica al entorno, utilizando la estrategia de fallback en cascada para las variables de Supabase. Esto hace que todo el pipeline del middleware sea funcional en un entorno de desarrollo local.
 * 2. **Documentación TSDoc de Élite**: ((Implementada)) La documentación ha sido actualizada para reflejar la nueva arquitectura de variables de entorno.
 *
 * @subsection Melhorias Futuras
 * 1. **Centralización de Nombres de Variables**: ((Vigente)) Los nombres literales de las variables de entorno se repiten en 3 archivos. Centralizarlos en un único archivo de configuración (`src/config/env.config.ts`) eliminaría la duplicación y el riesgo de errores de tipeo.
 *
 * =====================================================================
 */
// src/middleware/lib/supabase-edge.client.ts
