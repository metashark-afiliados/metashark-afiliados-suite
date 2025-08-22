// src/lib/supabase/server.ts
import "server-only";

import { cookies } from "next/headers";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { type Database } from "@/lib/types/database";

/**
 * @public
 * @function createClient
 * @description Factoría para crear una instancia del cliente Supabase para el entorno de servidor (Server Components, Server Actions).
 *              Implementa una estrategia de fallback en cascada para las variables de entorno,
 *              priorizando las inyectadas por Vercel (`INTEGRATION_...`) y recurriendo a las
 *              estándar (`NEXT_PUBLIC_...`) para el desarrollo local.
 * @returns Un cliente Supabase de servidor con gestión de cookies.
 * @author Raz Podestá
 * @version 9.0.0
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.INTEGRATION_NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.INTEGRATION_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignorar errores en contextos de solo lectura como las Server Actions de GET.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Ignorar errores en contextos de solo lectura.
          }
        },
      },
    }
  );
}

/**
 * @public
 * @function createAdminClient
 * @description Factoría para crear un cliente Supabase de servidor con privilegios de administrador (service_role).
 *              Utilizado para operaciones que deben eludir las políticas de Row Level Security (RLS).
 *              También implementa la estrategia de fallback en cascada para las variables de entorno.
 * @returns Un cliente Supabase de servidor con rol de servicio.
 * @author Raz Podestá
 * @version 9.0.0
 */
export function createAdminClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.INTEGRATION_NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.INTEGRATION_SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignorar errores en contextos de solo lectura.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Ignorar errores en contextos de solo lectura.
          }
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
 * 1. **Estrategia de Fallback en Cascada**: ((Implementada)) Las factorías ahora utilizan `process.env.INTEGRATION_... || process.env.STANDARD_...`, haciendo que el código sea agnóstico al entorno y restaurando la funcionalidad de desarrollo local. Esta es una implementación de élite que garantiza la resiliencia del proyecto.
 * 2. **Cero Regresiones**: ((Implementada)) Se ha preservado la lógica de gestión de cookies y la configuración del cliente de administrador, garantizando que no se pierda funcionalidad.
 * 3. **Documentación TSDoc de Élite**: ((Implementada)) Se ha actualizado la documentación para reflejar la nueva arquitectura de variables de entorno y el propósito de cada factoría.
 *
 * @subsection Melhorias Futuras
 * 1. **Centralización de la Lógica de Cookies**: ((Vigente)) La lógica de `cookies` se repite en ambas funciones. Podría ser abstraída a un helper `getServerCookieOptions()` para un código más DRY.
 *
 * =====================================================================
 */
// src/lib/supabase/server.ts
