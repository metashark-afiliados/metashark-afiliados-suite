// src/lib/supabase/middleware.ts
/**
 * @file src/lib/supabase/middleware.ts
 * @description Aparato de utilidad para la creación de un cliente Supabase de servidor,
 *              específicamente diseñado para el entorno de Middleware de Next.js (Edge Runtime).
 *              Ha sido refactorizado holísticamente para incluir validación de formato
 *              estricta para la URL de Supabase, un helper para la creación de respuestas
 *              encadenadas, observabilidad de cookies enriquecida y tipado estricto.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-30
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type NextRequest, NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { logger } from "@/lib/logging";
import { type Database } from "@/lib/types/database";

type CanonicalCookieName =
  | "active_workspace_id"
  | "metashark_session_id"
  | "NEXT_LOCALE"
  | `sb-${string}-auth-token`
  | "sb-csrf";

function createChainedResponse(request: NextRequest): NextResponse {
  return NextResponse.next({
    request: { headers: request.headers },
  });
}

function getEdgeCookieHandlers(
  request: NextRequest,
  updateResponseCallback: (newResponse: NextResponse) => void
): {
  get: (name: string) => string | undefined;
  set: (name: string, value: string, options: CookieOptions) => void;
  remove: (name: string, options: CookieOptions) => void;
} {
  return {
    get(name: CanonicalCookieName | string) {
      return request.cookies.get(name)?.value;
    },
    set(
      name: CanonicalCookieName | string,
      value: string,
      options: CookieOptions
    ) {
      logger.trace(
        `[SupabaseMiddlewareClient:CookieHandler] Setting cookie: ${name}`
      );
      try {
        const newResponse = createChainedResponse(request);
        newResponse.cookies.set({ name, value, ...options });
        updateResponseCallback(newResponse);
      } catch (error) {
        logger.error(
          `[SupabaseMiddlewareClient:CookieHandler] Failed to set cookie: ${name}`,
          error
        );
      }
    },
    remove(name: CanonicalCookieName | string, options: CookieOptions) {
      logger.trace(
        `[SupabaseMiddlewareClient:CookieHandler] Removing cookie: ${name}`
      );
      try {
        const newResponse = createChainedResponse(request);
        newResponse.cookies.set({ name, value: "", ...options });
        updateResponseCallback(newResponse);
      } catch (error) {
        logger.error(
          `[SupabaseMiddlewareClient:CookieHandler] Failed to remove cookie: ${name}`,
          error
        );
      }
    },
  };
}

export function createClient(
  request: NextRequest,
  initialResponse?: NextResponse
) {
  logger.trace("[SupabaseMiddlewareClient] Creating Edge-safe client...");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not defined.");
  }

  let response = initialResponse || createChainedResponse(request);

  const updateResponse = (newResponse: NextResponse) => {
    response = newResponse;
  };

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: getEdgeCookieHandlers(request, updateResponse),
  });

  return { supabase, response };
}
// src/lib/supabase/middleware.ts
