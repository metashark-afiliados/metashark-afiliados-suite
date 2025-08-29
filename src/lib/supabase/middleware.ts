// src/lib/supabase/middleware.ts
/**
 * @file src/lib/supabase/middleware.ts
 * @description Aparato de utilidad para la creación de un cliente Supabase de servidor,
 *              específicamente diseñado para el entorno de Middleware de Next.js (Edge Runtime).
 *              Ha sido refactorizado holísticamente para un encadenamiento de respuestas
 *              robusto y una observabilidad completa, garantizando la compatibilidad con
 *              el Edge Runtime y resolviendo un fallo crítico de despliegue en Vercel.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type NextRequest, NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { logger } from "@/lib/logging";
import { type Database } from "@/lib/types/database";

/**
 * @public
 * @async
 * @function createClient
 * @description Factoría para crear una instancia del cliente de Supabase dentro del Middleware.
 *              Esta función es la única forma canónica de interactuar con Supabase en el
 *              Edge Runtime de manera segura y con estado.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @returns {{ supabase: import('@supabase/supabase-js').SupabaseClient<Database>; response: NextResponse; }} Un objeto que contiene
 *          tanto la instancia del cliente Supabase como un nuevo objeto de respuesta.
 */
export function createClient(request: NextRequest) {
  logger.trace(
    "[SupabaseMiddlewareClient] Creando instancia de cliente Edge-safe..."
  );

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          logger.trace(`[SupabaseMiddlewareClient] Setting cookie: ${name}`);
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          logger.trace(`[SupabaseMiddlewareClient] Removing cookie: ${name}`);
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  return { supabase, response };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Manejo de Errores en `getUser`**: Envolver la llamada `supabase.auth.getUser()` que se realiza en el consumidor de este cliente (`permissions-edge.ts`) en un bloque `try/catch` para registrar explícitamente cualquier error que ocurra durante el refresco de la sesión, lo que mejoraría la capacidad de diagnóstico de problemas de autenticación en el Edge.
 * 2. **Factoría de Opciones de Cookie**: La lógica de `cookies` es un candidato para ser extraída a una función `getCookieHandlers(req, res)` si se necesita reutilizar en otros clientes de Supabase para el Edge, adhiriéndose al principio DRY.
 * 3. **Validación de Variables de Entorno**: Añadir una validación al inicio de la función para comprobar que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` existen, lanzando un error descriptivo si no están configuradas para prevenir fallos silenciosos.
 * =====================================================================
 */
