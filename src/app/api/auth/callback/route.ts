// src/app/api/auth/callback/route.ts
/**
 * @file src/app/api/auth/callback/route.ts
 * @description Route Handler para el callback de autenticación. Ha sido
 *              refactorizado para "Producción Total", eliminando la lógica de
 *              simulación para interactuar siempre con la API real de Supabase
 *              y manteniendo la validación de seguridad anti "Open Redirect".
 * @author Raz Podestá
 * @version 3.0.0
 */
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";

/**
 * @private
 * @function isValidRedirect
 * @description Valida que una ruta de redirección sea segura (interna).
 * @param {string} path - La ruta a validar.
 * @returns {boolean} `true` si la ruta es segura.
 */
const isValidRedirect = (path: string): boolean => {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes(":");
};

/**
 * @public
 * @async
 * @function GET
 * @description Maneja el callback de autenticación de Supabase (OAuth y Magic Links).
 *              Intercambia el código de autorización por una sesión de usuario.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @returns {Promise<NextResponse>} Una redirección al dashboard o a una página de error.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  let redirectTo = `${origin}/dashboard`;
  if (next && isValidRedirect(next)) {
    redirectTo = `${origin}${next}`;
    logger.trace(`[AuthCallback] Redirección segura validada para: ${next}`);
  } else if (next) {
    logger.warn(`[SEGURIDAD] Intento de Open Redirect bloqueado.`, {
      nextParam: next,
      fallback: redirectTo,
    });
  }

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      logger.info(
        "[AuthCallback] Intercambio de código exitoso. Redirigiendo usuario.",
        { redirectTo }
      );
      return NextResponse.redirect(redirectTo);
    }
    logger.error("[AuthCallback] Error en exchangeCodeForSession.", {
      error: error.message,
    });
  } else {
    logger.warn(
      "[AuthCallback] Petición a callback sin código de autorización."
    );
  }

  const errorUrl = `${origin}/auth/login?error=true&message=error_oauth_failed`;
  return NextResponse.redirect(errorUrl);
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Orientado a Producción**: ((Implementada)) Se ha eliminado el bloque condicional que manejaba el `dev-mock-code`. La ruta ahora solo procesa códigos de autorización reales, lo que la hace más segura y simple.
 *
 * @subsection Melhorias Futuras
 * 1. **Lista Blanca de Rutas de Redirección**: ((Vigente)) Para una seguridad de élite, la función `isValidRedirect` podría ser mejorada para validar la ruta `next` contra una lista blanca de rutas conocidas de la aplicación, en lugar de solo una validación de formato.
 *
 * =====================================================================
 */
