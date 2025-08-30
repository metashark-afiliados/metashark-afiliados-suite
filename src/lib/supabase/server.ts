// src/lib/supabase/server.ts
/**
 * @file src/lib/supabase/server.ts
 * @description Factoría para clientes Supabase en el entorno de servidor (Server
 *              Components, Server Actions). Ha sido refactorizado holísticamente
 *              para ser agnóstico al entorno, eliminando la lógica de fallback
 *              a variables `INTEGRATION_` y dependiendo únicamente de las variables
 *              canónicas del proyecto.
 * @author Raz Podestá - MetaShark Tech
 * @version 10.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import "server-only";

import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { type Database } from "@/lib/types/database";

/**
 * @public
 * @function createClient
 * @description Factoría para crear una instancia del cliente Supabase para el entorno de servidor.
 * @returns Un cliente Supabase de servidor con gestión de cookies.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
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
 * @returns Un cliente Supabase de servidor con rol de servicio.
 */
export function createAdminClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
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
            // Ignorar.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Ignorar.
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
 * @subsection Melhorias Futuras
 * 1. **Centralización de Lógica de Cookies**: La lógica del objeto `cookies` se repite en ambas funciones (`createClient` y `createAdminClient`). Podría ser abstraída a un helper `getServerCookieOptions(cookieStore)` para un código más DRY.
 * 2. **Observabilidad en Cliente Admin**: Añadir un `logger.warn` cuando se instancia el `createAdminClient` en un entorno de desarrollo para alertar sobre el uso de un cliente con privilegios elevados.
 * 3. **Manejo de Errores en Cookies**: Los bloques `catch` en los manejadores `set` y `remove` de cookies actualmente ignoran los errores de forma silenciosa. Podrían ser mejorados para registrar una advertencia (`logger.warn`) cuando ocurra un error, proporcionando una mayor visibilidad durante la depuración de flujos de solo lectura que intenten modificar cookies.
 * 4. **Tipado de Nombres de Cookie**: Implementar un tipo `CanonicalCookieName` y usarlo en la firma de `get`, `set`, y `remove` para garantizar la consistencia en el manejo de cookies.
 * =====================================================================
 */
// src/lib/supabase/server.ts
