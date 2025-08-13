// src/middleware/handlers/auth/index.ts
/**
 * @file src/middleware/handlers/auth/index.ts
 * @description Motor de reglas de autorización de élite para el middleware.
 *              Este aparato consume el manifiesto de enrutamiento (`routing-manifest.ts`)
 *              para aplicar de forma centralizada las políticas de seguridad a todas
 *              las rutas de la aplicación. Es la única fuente de verdad para la
 *              autorización a nivel de enrutamiento.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { type NextRequest, NextResponse } from "next/server";

import {
  getAuthDataForMiddleware,
  type UserAuthData,
} from "@/lib/auth/middleware-permissions";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/middleware";
import { ROUTE_MANIFEST, type RouteSecurityRule } from "@/lib/routing-manifest";

/**
 * @private
 * @function findMatchingRouteRule
 * @description Busca en `ROUTE_MANIFEST` la regla más específica que coincida con el pathname.
 * @param {string} pathname - La ruta a verificar.
 * @returns {RouteSecurityRule | undefined} La regla encontrada o undefined.
 */
function findMatchingRouteRule(
  pathname: string
): RouteSecurityRule | undefined {
  return ROUTE_MANIFEST.find((rule) => pathname.startsWith(rule.path));
}

/**
 * @private
 * @function handleUnauthenticated
 * @description Maneja la lógica para usuarios no autenticados.
 * @returns {NextResponse | null} Una redirección si es necesario, o null.
 */
function handleUnauthenticated(
  request: NextRequest,
  rule: RouteSecurityRule,
  pathname: string,
  locale: string
): NextResponse | null {
  if (rule.classification === "protected") {
    const loginUrl = new URL(`/${locale}/auth/login`, request.nextUrl.origin);
    loginUrl.searchParams.set("next", pathname);
    logger.info(
      "[AUTH_HANDLER] Usuario no autenticado en ruta protegida. Redirigiendo a login.",
      { from: pathname, to: loginUrl.pathname }
    );
    return NextResponse.redirect(loginUrl);
  }
  return null;
}

/**
 * @private
 * @function handleAuthenticated
 * @description Maneja la lógica para usuarios autenticados, incluyendo la verificación de roles.
 * @returns {NextResponse | null} Una redirección si es necesario, o null.
 */
function handleAuthenticated(
  request: NextRequest,
  authData: UserAuthData,
  rule: RouteSecurityRule,
  pathname: string,
  locale: string
): NextResponse | null {
  const { origin } = request.nextUrl;
  const dashboardUrl = new URL(`/${locale}/dashboard`, origin);

  if (rule.classification === "auth") {
    logger.info(
      "[AUTH_HANDLER] Usuario autenticado en ruta de autenticación. Redirigiendo a dashboard.",
      { from: pathname }
    );
    return NextResponse.redirect(dashboardUrl);
  }

  if (rule.classification === "protected" && rule.requiredRoles) {
    if (!rule.requiredRoles.includes(authData.appRole)) {
      logger.warn(
        "[AUTH_HANDLER] VIOLACIÓN DE PERMISOS: Acceso denegado a la ruta.",
        {
          userId: authData.user.id,
          role: authData.appRole,
          required: rule.requiredRoles,
          path: pathname,
        }
      );
      const unauthorizedUrl = new URL(`/${locale}/unauthorized`, origin);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return null;
}

/**
 * @public
 * @async
 * @function handleAuth
 * @description Orquesta el flujo de autorización. Obtiene la sesión del usuario,
 *              encuentra la regla de seguridad aplicable y delega la decisión a los
 *              helpers `handleUnauthenticated` o `handleAuthenticated`.
 * @param {NextRequest} request - La petición entrante.
 * @param {NextResponse} response - La respuesta del manejador anterior.
 * @returns {Promise<NextResponse>} La respuesta final, que puede ser una redirección o la original.
 */
export async function handleAuth(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  logger.trace("==> [AUTH_HANDLER] START <==", { path: pathname });

  const locale = response.headers.get("x-app-locale") || "pt-BR";
  const pathnameWithoutLocale =
    pathname.replace(new RegExp(`^/${locale}`), "") || "/";

  // El cliente de Supabase se crea aquí para que la sesión sea accesible.
  const { response: supabaseResponse } = await createClient(request, response);
  const authData = await getAuthDataForMiddleware();

  let rule = findMatchingRouteRule(pathnameWithoutLocale);

  if (!rule) {
    logger.warn(
      "[AUTH_HANDLER] No se encontró regla explícita en el manifiesto. Aplicando default seguro (protected).",
      { path: pathnameWithoutLocale }
    );
    rule = { path: pathnameWithoutLocale, classification: "protected" };
  }

  let redirectResponse: NextResponse | null = null;
  if (!authData) {
    redirectResponse = handleUnauthenticated(request, rule, pathname, locale);
  } else {
    redirectResponse = handleAuthenticated(
      request,
      authData,
      rule,
      pathnameWithoutLocale,
      locale
    );
  }

  logger.trace("==> [AUTH_HANDLER] END <==", {
    path: pathname,
    action: redirectResponse ? "REDIRECT" : "PASS",
  });

  return redirectResponse || supabaseResponse;
}
