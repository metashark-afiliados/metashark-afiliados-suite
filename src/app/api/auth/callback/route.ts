// src/app/api/auth/callback/route.ts
/**
 * @file src/app/api/auth/callback/route.ts
 * @description Route Handler para el callback de autenticación. Nivelado a un
 *              estándar de élite con validación de seguridad para prevenir
 *              vulnerabilidades de "Open Redirect".
 * @author Raz Podestá
 * @version 2.1.0
 */
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";

const isDevMode =
  process.env.NODE_ENV === "development" &&
  process.env.DEV_MODE_ENABLED === "true";

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

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next"); // ej. "/dashboard/sites"

  // --- INICIO DE LÓGICA DE SEGURIDAD "OPEN REDIRECT" ---
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
  // --- FIN DE LÓGICA DE SEGURIDAD ---

  if (isDevMode && code === "dev-mock-code") {
    logger.info(
      "[AuthCallback:DevMock] Código simulado recibido. Estableciendo sesión de desarrollo."
    );
    cookies().set("dev_session", "true", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });
    return NextResponse.redirect(redirectTo);
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
 * 1. **Prevención de Open Redirect**: ((Implementada)) Se ha añadido la función `isValidRedirect` y la lógica correspondiente para validar el parámetro `next`. Esto fortalece la seguridad del flujo de autenticación, una mejora crítica.
 * 2. **Observabilidad de Seguridad**: ((Implementada)) Se ha añadido un `logger.warn` específico para registrar intentos de redirección maliciosos, proporcionando una visibilidad clara sobre posibles ataques.
 *
 * @subsection Melhorias Futuras
 * 1. **Lista Blanca de Rutas**: ((Vigente)) Para una seguridad aún más estricta, la función `isValidRedirect` podría ser mejorada para validar la ruta contra el `ROUTE_MANIFEST`, asegurando que solo se pueda redirigir a rutas conocidas por la aplicación.
 *
 * =====================================================================
 */
// src/app/api/auth/callback/route.ts
