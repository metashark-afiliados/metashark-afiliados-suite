// src/lib/supabase/server.ts
/**
 * @file src/lib/supabase/server.ts
 * @description Aparato de utilidad para la creación de clientes Supabase de servidor.
 *              Ha sido nivelado para soportar Inyección de Dependencias, aceptando
 *              un `cookieStore` explícito. Esto permite su uso dentro de funciones
 *              cacheadas (`unstable_cache`) sin violar las reglas de funciones dinámicas.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { type ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { type Database } from "@/lib/types/database";

/**
 * @public
 * @function createClient
 * @description Factoría para crear un cliente de Supabase del lado del servidor.
 * @param {ReadonlyRequestCookies} [cookieStore] - Instancia opcional de `cookies()`. Si se omite, se invoca `cookies()` dinámicamente.
 * @returns {import('@supabase/supabase-js').SupabaseClient<Database>}
 */
export function createClient(cookieStore?: ReadonlyRequestCookies) {
  const store = cookieStore || cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return store.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            store.set({ name, value, ...options });
          } catch (_error) {
            // Ignorado de forma segura.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            store.set({ name, value: "", ...options });
          } catch (_error) {
            // Ignorado de forma segura.
          }
        },
      },
    }
  );
}

/**
 * @public
 * @function createAdminClient
 * @description Factoría para crear un cliente de Supabase con privilegios de administrador.
 * @param {ReadonlyRequestCookies} [cookieStore] - Instancia opcional de `cookies()`.
 * @returns {import('@supabase/supabase-js').SupabaseClient<Database>}
 */
export function createAdminClient(cookieStore?: ReadonlyRequestCookies) {
  const store = cookieStore || cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return store.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            store.set({ name, value, ...options });
          } catch (_error) {
            // Ignorado
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            store.set({ name, value: "", ...options });
          } catch (_error) {
            // Ignorado
          }
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
 * 1. **Soporte para Inyección de Dependencias**: ((Implementada)) Las factorías ahora aceptan `cookieStore` como argumento, desacoplando la creación del cliente de la invocación dinámica de `cookies()`.
 * 2. **Resolución de Error de Cache**: ((Implementada)) Este cambio es el primer paso crítico para resolver el error de `unstable_cache`.
 *
 * =====================================================================
 */
// src/lib/supabase/server.ts
