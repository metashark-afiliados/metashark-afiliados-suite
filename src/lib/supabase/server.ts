// src/lib/supabase/server.ts
/**
 * @file src/lib/supabase/server.ts
 * @description Aparato de utilidad para la creación de clientes Supabase de servidor.
 *              Ha sido refactorizado para "Producción Total", eliminando toda la
 *              lógica condicional de `DEV_MODE` para interactuar siempre con la
 *              base de datos remota real.
 * @author L.I.A. Legacy
 * @version 7.0.0
 */
import "server-only";

import { cookies } from "next/headers";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { type Database } from "@/lib/types/database";

/**
 * @public
 * @function createClient
 * @description Factoría para crear un cliente de Supabase del lado del servidor.
 *              Siempre se conecta a la base de datos remota.
 * @returns {import('@supabase/supabase-js').SupabaseClient<Database>}
 */
export function createClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_INTEGRATION_NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_INTEGRATION_NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookies().set({ name, value, ...options });
          } catch (_error) {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookies().set({ name, value: "", ...options });
          } catch (_error) {}
        },
      },
    }
  );
}

/**
 * @public
 * @function createAdminClient
 * @description Factoría para crear un cliente de Supabase con privilegios de administrador.
 *              Siempre se conecta a la base de datos remota.
 * @returns {import('@supabase/supabase-js').SupabaseClient<Database>}
 */
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.INTEGRATION_NEXT_PUBLIC_SUPABASE_URL!,
    process.env.INTEGRATION_SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookies().set({ name, value, ...options });
          } catch (_error) {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookies().set({ name, value: "", ...options });
          } catch (_error) {}
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
 * 1. **Orientado a Producción**: ((Implementada)) Se ha eliminado toda la lógica de `DEV_MODE`. Este aparato ahora es una factoría de cliente de producción pura, lo que simplifica el código y elimina una posible fuente de errores.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Variables de Entorno**: ((Vigente)) Añadir una validación en tiempo de inicio para asegurar que las variables de entorno de Supabase estén definidas, previniendo fallos en runtime.
 *
 * =====================================================================
 */
