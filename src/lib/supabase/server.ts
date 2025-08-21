// src/lib/supabase/server.ts
/**
 * @file src/lib/supabase/server.ts
 * @description Aparato de utilidad para la creación de clientes Supabase de servidor.
 *              Ha sido refactorizado para consumir las variables de entorno con prefijo
 *              gestionadas por la integración de Vercel.
 * @author L.I.A. Legacy
 * @version 6.0.0
 */
import "server-only";

import { cookies } from "next/headers";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { type Database } from "@/lib/types/database";
import { logger } from "@/lib/logging";
import { createDevMockSupabaseClient } from "./mock-client-factory";

export function createClient() {
  const isDevMode =
    process.env.NODE_ENV === "development" &&
    process.env.DEV_MODE_ENABLED === "true";

  if (isDevMode) {
    logger.warn(
      "🚧 [SERVER] Modo Desarrollador ACTIVO. Conexión a Supabase REAL ignorada."
    );
    return createDevMockSupabaseClient(
      cookies()
    ) as import("@supabase/supabase-js").SupabaseClient<Database>;
  }

  return createServerClient<Database>(
    process.env.INTEGRATION_NEXT_PUBLIC_SUPABASE_URL!,
    process.env.INTEGRATION_NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

export function createAdminClient() {
  const isDevMode =
    process.env.NODE_ENV === "development" &&
    process.env.DEV_MODE_ENABLED === "true";

  if (isDevMode) {
    logger.warn(
      "🚧 [SERVER - ADMIN] Modo Desarrollador ACTIVO. Conexión a Supabase REAL ignorada."
    );
    return createDevMockSupabaseClient(
      cookies()
    ) as import("@supabase/supabase-js").SupabaseClient<Database>;
  }

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
 * 1. **Consumo de SSoT de Credenciales**: ((Implementada)) Los clientes ahora consumen las variables de entorno gestionadas por la integración de Vercel.
 *
 * =====================================================================
 */
