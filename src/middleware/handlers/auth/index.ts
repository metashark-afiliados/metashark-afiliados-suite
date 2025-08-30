// src/middleware/handlers/auth/index.ts
/**
 * @file src/middleware/handlers/auth/index.ts
 * @description Motor de reglas de autorización de élite para el middleware.
 *              Ha sido refactorizado holísticamente para consumir el nuevo aparato
 *              soberano `permissions-edge.ts`, desacoplándolo de la capa de datos
 *              del servidor y resolviendo el `TypeError` de runtime.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-30
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logging";
import {
  getAuthDataForMiddleware,
  type UserAuthData,
} from "@/middleware/lib/permissions-edge";
import {
  ROUTE_MANIFEST,
  type RouteSecurityRule,
} from "@/middleware/lib/routing-manifest-edge";

/**
 * @private
 * @function createRedirectResponse
 * @description Helper atómico que construye una respuesta de redirección.
 * @param {NextRequest} request - El objeto de la petición original.
 * @param {string} locale - El locale para la URL de destino.
 * @param {string} path - La ruta de destino.
 * @param {URLSearchParams} [searchParams] - Parámetros de búsqueda opcionales.
 * @returns {NextResponse} Un objeto de respuesta de redirección.
 */
function createRedirectResponse(
  request: NextRequest,
  locale: string,
  path: string,
  searchParams?: URLSearchParams
): NextResponse {
  const redirectUrl = new URL(`/${locale}${path}`, request.nextUrl.origin);
  if (searchParams) {
    redirectUrl.search = searchParams.toString();
  }
  return NextResponse.redirect(redirectUrl);
}

/**
 * @private
 * @function findMatchingRouteRule
 * @description Encuentra la regla de seguridad que coincide con el pathname.
 * @param {string} pathname - La ruta a verificar.
 * @returns {RouteSecurityRule | undefined} La regla de seguridad encontrada.
 */
function findMatchingRouteRule(
  pathname: string
): RouteSecurityRule | undefined {
  return ROUTE_MANIFEST.find((rule) => pathname.startsWith(rule.path));
}

/**
 * @private
 * @function handleUnauthenticated
 * @description Gestiona la lógica para usuarios no autenticados.
 * @returns {NextResponse | null} Una respuesta de redirección o null.
 */
function handleUnauthenticated(
  request: NextRequest,
  rule: RouteSecurityRule,
  pathname: string,
  locale: string
): NextResponse | null {
  if (rule.classification === "protected") {
    const searchParams = new URLSearchParams({ next: pathname });
    logger.info(
      "[AUTH_HANDLER] Usuario no autenticado en ruta protegida. Redirigiendo a login.",
      { from: pathname, to: `/${locale}/login` }
    );
    return createRedirectResponse(request, locale, "/login", searchParams);
  }
  return null;
}

/**
 * @private
 * @function handleAuthenticated
 * @description Gestiona la lógica para usuarios autenticados.
 * @returns {NextResponse | null} Una respuesta de redirección o null.
 */
function handleAuthenticated(
  request: NextRequest,
  authData: UserAuthData,
  rule: RouteSecurityRule,
  pathname: string,
  locale: string
): NextResponse | null {
  if (rule.classification === "auth") {
    logger.info(
      "[AUTH_HANDLER] Usuario autenticado en ruta de autenticación. Redirigiendo a dashboard.",
      { from: pathname, userId: authData.user.id }
    );
    return createRedirectResponse(request, locale, "/dashboard");
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
      return createRedirectResponse(request, locale, "/unauthorized");
    }
  }

  return null;
}

/**
 * @public
 * @async
 * @function handleAuth
 * @description Orquesta el flujo de autorización para una petición.
 * @param {NextRequest} request - La petición entrante.
 * @param {NextResponse} response - La respuesta del handler anterior en el pipeline.
 * @returns {Promise<NextResponse>} La respuesta final (potencialmente una redirección)
 *          o la respuesta actualizada con las cookies de sesión.
 */
export async function handleAuth(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  logger.trace("==> [AUTH_HANDLER] START <==", { path: pathname });

  if (process.env.DEV_MODE_AUTH_BYPASS === "true") {
    logger.warn(
      "[AUTH_HANDLER] MODO BYPASS ACTIVO. Se omitirá la lógica de autorización."
    );
    return response;
  }

  const { authData, response: responseAfterAuthCheck } =
    await getAuthDataForMiddleware(request, response);

  const locale = response.headers.get("x-app-locale") || "pt-BR";
  const pathnameWithoutLocale =
    pathname.replace(new RegExp(`^/${locale}`), "") || "/";

  let rule = findMatchingRouteRule(pathnameWithoutLocale);
  if (!rule) {
    // Si no se encuentra una regla explícita, se asume que la ruta es protegida por defecto.
    rule = { path: pathnameWithoutLocale, classification: "protected" };
  }

  let finalResponse = responseAfterAuthCheck;
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

  if (redirectResponse) {
    finalResponse = redirectResponse;
  }

  logger.trace("==> [AUTH_HANDLER] END <==", {
    path: pathname,
    action: redirectResponse ? "REDIRECT" : "PASS",
  });

  return finalResponse;
}
// src/middleware/handlers/auth/index.ts
