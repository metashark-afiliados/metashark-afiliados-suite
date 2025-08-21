// src/middleware/lib/supabase-edge.client.ts
/**
 * @file src/middleware/lib/supabase-edge.client.ts
 * @description Aparato de utilidad para crear un cliente Supabase para el Edge.
 *              Ha sido refactorizado para consumir las variables de entorno con prefijo
 *              `INTEGRATION_` gestionadas por la integración de Vercel.
 * @author L.I.A. Legacy
 * @version 11.1.0
 */
import "server-only";

import { type NextRequest, type NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { type Database } from "@/lib/types/database";

export async function createEdgeClient(
  request: NextRequest,
  response: NextResponse
) {
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
 * 1. **Alineación con Vercel**: ((Implementada)) El cliente de Edge ahora consume las variables de entorno con prefijo, alineándose con la configuración actual del despliegue y resolviendo el error de build.
 *
 * =====================================================================
 */
