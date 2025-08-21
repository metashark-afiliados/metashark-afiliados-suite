// src/lib/supabase/server.ts
/**
 * @file src/lib/supabase/server.ts
 * @description Aparato de utilidad para la creación de clientes Supabase de servidor.
 *              Ha sido refactorizado para consumir las variables de entorno con prefijo
 *              `INTEGRATION_` gestionadas por la integración de Vercel.
 * @author L.I.A. Legacy
 * @version 8.1.0
 */
import "server-only";

import { cookies } from "next/headers";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { type Database } from "@/lib/types/database";

export function createClient() {
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
 * 1. **Alineación con Vercel**: ((Implementada)) Los clientes ahora consumen las variables de entorno con prefijo, alineándose con la configuración actual del despliegue.
 *
 * =====================================================================
 */
