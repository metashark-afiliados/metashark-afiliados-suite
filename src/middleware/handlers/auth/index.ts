// src/middleware/handlers/auth/index.ts
/**
 * @file src/middleware/handlers/auth/index.ts
 * @description Motor de reglas de autorización de élite para el middleware.
 *              Ha sido refactorizado holísticamente para consumir el nuevo aparato
 *              soberano `permissions-edge.ts`, desacoplándolo de la capa de datos
 *              del servidor y resolviendo el `TypeError` de runtime.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-29
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
    status: finalResponse.status,
    headers: Object.fromEntries(finalResponse.headers.entries()),
  });

  return finalResponse;
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Factoría de Reglas de Ruta para Rutas Dinámicas**: La función `findMatchingRouteRule` actual utiliza `startsWith`, lo cual es efectivo para rutas base. Para una granularidad de élite en rutas dinámicas (ej. `/dashboard/sites/[siteId]/settings` con permisos específicos), esta función debería ser mejorada para usar una librería de coincidencia de patrones de ruta (como `path-to-regexp`) para una resolución más precisa.
 * 2. **Cacheo de Reglas de Ruta**: Si el `ROUTE_MANIFEST` fuera a ser cargado desde una base de datos en el futuro, la función `findMatchingRouteRule` sería un candidato ideal para ser envuelta en un caché de alta velocidad (como Vercel KV o un caché en memoria) para evitar consultas a la base de datos en cada petición del middleware.
 * 3. **Gestión de Roles Múltiples**: La lógica actual de `handleAuthenticated` verifica si un usuario tiene *alguno* de los roles requeridos. Podría ser extendida para soportar una lógica más compleja, como requerir *todos* los roles de una lista, si el modelo de permisos evoluciona.
 * 4. **Manejo de Errores de Redirección**: El helper `createRedirectResponse` podría ser blindado con un bloque `try/catch` para manejar errores de URL inválida, aunque con la estructura actual de `path` controlado internamente, el riesgo es bajo.
 * =====================================================================
 */
// src/middleware/handlers/auth/index.ts
