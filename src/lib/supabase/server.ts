// src/lib/supabase/server.ts
/**
 * @file src/lib/supabase/server.ts
 * @description Aparato de utilidad para la creación de clientes Supabase de servidor.
 *              Ha sido refactorizado para consumir la nueva factoría de mocks atomizada,
 *              completando la refactorización arquitectónica para este aparato.
 * @author L.I.A. Legacy
 * @version 5.0.0
 */
import "server-only";

import { type ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { type Database } from "@/lib/types/database";
import { logger } from "@/lib/logging";
import { createDevMockSupabaseClient } from "./mock-client-factory";

/**
 * @public
 * @function createClient
 * @description Factoría para crear un cliente de Supabase del lado del servidor.
 * @param {ReadonlyRequestCookies} [cookieStore] - Instancia opcional de `cookies()`.
 * @returns {import('@supabase/supabase-js').SupabaseClient<Database>}
 */
export function createClient(cookieStore?: ReadonlyRequestCookies) {
  const store = cookieStore || cookies();

  const isDevMode =
    process.env.NODE_ENV === "development" &&
    process.env.DEV_MODE_ENABLED === "true";

  if (isDevMode) {
    logger.warn(
      "🚧 [SERVER] Modo Desarrollador ACTIVO. Conexión a Supabase REAL ignorada."
    );
    return createDevMockSupabaseClient(
      store
    ) as import("@supabase/supabase-js").SupabaseClient<Database>;
  }

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

  const isDevMode =
    process.env.NODE_ENV === "development" &&
    process.env.DEV_MODE_ENABLED === "true";

  if (isDevMode) {
    logger.warn(
      "🚧 [SERVER - ADMIN] Modo Desarrollar ACTIVO. Conexión a Supabase REAL ignorada."
    );
    return createDevMockSupabaseClient(
      store
    ) as import("@supabase/supabase-js").SupabaseClient<Database>;
  }

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
 * 1. **Sincronización Arquitectónica**: ((Implementada)) El aparato ahora importa la factoría de mocks desde `mock-client-factory.ts`, alineándose con la nueva arquitectura atomizada.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Variables de Entorno**: ((Vigente)) Añadir una validación estricta para asegurar que las variables de entorno de Supabase estén definidas en producción.
 *
 * =====================================================================
 */
// src/lib/supabase/server.ts
