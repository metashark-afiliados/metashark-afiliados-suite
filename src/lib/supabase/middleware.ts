// src/lib/supabase/middleware.ts
/**
 * @file src/lib/supabase/middleware.ts
 * @description Aparato de utilidad para la creación de un cliente Supabase de servidor,
 *              específicamente diseñado para el entorno de Middleware de Next.js (Edge Runtime).
 *              Implementa el patrón de "respuesta encadenada" para una gestión de
 *              cookies robusta e inmutable.
 * @author L.I.A. Legacy
 * @copilot RaZ WriTe
 * @version 6.0.0
 * @see .docs-espejo/lib/supabase/middleware.md
 */
import { type NextRequest, NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { logger } from "@/lib/logger";
import { type Database } from "@/lib/types/database";

type CanonicalCookieName =
  | "active_workspace_id"
  | "metashark_session_id"
  | "NEXT_LOCALE"
  | `sb-${string}-auth-token`
  | "sb-csrf";

function createChainedResponse(request: NextRequest): NextResponse {
  const headers = new Headers(request.headers);
  headers.set("x-request-id", crypto.randomUUID());
  return NextResponse.next({ request: { headers } });
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
        { cookieName: name },
        `[SupabaseMiddlewareClient:CookieHandler] Setting cookie.`
      );
      try {
        // Se clona la request para crear una nueva response y aplicar la cookie.
        const newResponse = createChainedResponse(request);
        newResponse.cookies.set({ name, value, ...options });
        // Se notifica al orquestador sobre la nueva response.
        updateResponseCallback(newResponse);
      } catch (error) {
        logger.error(
          { cookieName: name, error },
          `[SupabaseMiddlewareClient:CookieHandler] Failed to set cookie.`
        );
      }
    },
    remove(name: CanonicalCookieName | string, options: CookieOptions) {
      logger.trace(
        { cookieName: name },
        `[SupabaseMiddlewareClient:CookieHandler] Removing cookie.`
      );
      try {
        const newResponse = createChainedResponse(request);
        newResponse.cookies.set({ name, value: "", ...options });
        updateResponseCallback(newResponse);
      } catch (error) {
        logger.error(
          { cookieName: name, error },
          `[SupabaseMiddlewareClient:CookieHandler] Failed to remove cookie.`
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

  // Utiliza la respuesta inicial o crea una nueva.
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
