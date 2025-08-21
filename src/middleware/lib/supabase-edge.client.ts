// src/middleware/lib/supabase-edge.client.ts
/**
 * @file src/middleware/lib/supabase-edge.client.ts
 * @description Aparato de utilidad para crear un cliente Supabase para el Edge.
 *              Ha sido refactorizado para consumir las variables de entorno con prefijo
 *              gestionadas por la integración de Vercel.
 * @author L.I.A. Legacy
 * @version 10.0.0
 */
import "server-only";

import { type NextRequest, type NextResponse } from "next/server";
import { type CookieOptions } from "@supabase/ssr";

import { logger } from "@/lib/logging";
import { type Database } from "@/lib/types/database";
import { DEV_USER } from "@tests/mocks/data/database-state";

const isDevMode =
  process.env.NODE_ENV === "development" &&
  process.env.DEV_MODE_ENABLED === "true";

export async function createEdgeClient(
  request: NextRequest,
  response: NextResponse
) {
  if (isDevMode) {
    logger.warn(
      "🚧 [EDGE] Modo Desarrollador ACTIVO. Devolviendo cliente Supabase SIMULADO EN MEMORIA."
    );
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({ data: { app_role: "developer" }, error: null }),
          }),
        }),
      }),
      auth: {
        getUser: () =>
          Promise.resolve({ data: { user: DEV_USER }, error: null }),
      },
    } as unknown as import("@supabase/supabase-js").SupabaseClient<Database>;
  }

  const { createServerClient } = await import("@supabase/ssr");

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
 * 1. **Consumo de SSoT de Credenciales**: ((Implementada)) El cliente de Edge ahora consume las variables de entorno gestionadas por la integración de Vercel.
 *
 * =====================================================================
 */
