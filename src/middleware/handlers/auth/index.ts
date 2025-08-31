// src/middleware/handlers/auth/index.ts
/**
 * @file src/middleware/handlers/auth/index.ts
 * @description Motor de reglas de autorización de élite para el middleware.
 *              Ha sido refactorizado holísticamente para alinearse con el patrón
 *              de "respuesta encadenada", resolviendo una regresión crítica
 *              en el Edge Runtime.
 * @author Raz Podestá - MetaShark Tech
 * @version 7.0.0
 * @date 2025-08-31
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

function findMatchingRouteRule(
  pathname: string
): RouteSecurityRule | undefined {
  return ROUTE_MANIFEST.find((rule) => pathname.startsWith(rule.path));
}

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

  // --- INICIO DE REFACTORIZACIÓN: PATRÓN DE RESPUESTA ENCADENADA ---
  const { authData, response: responseAfterAuthCheck } =
    await getAuthDataForMiddleware(request, response);

  const locale = response.headers.get("x-app-locale") || "pt-BR";
  const pathnameWithoutLocale =
    pathname.replace(new RegExp(`^/${locale}`), "") || "/";

  let rule = findMatchingRouteRule(pathnameWithoutLocale);
  if (!rule) {
    rule = { path: pathnameWithoutLocale, classification: "protected" };
  }

  const redirectResponse = authData
    ? handleAuthenticated(
        request,
        authData,
        rule,
        pathnameWithoutLocale,
        locale
      )
    : handleUnauthenticated(request, rule, pathname, locale);

  const finalResponse = redirectResponse || responseAfterAuthCheck;
  // --- FIN DE REFACTORIZACIÓN ---

  logger.trace("==> [AUTH_HANDLER] END <==", {
    path: pathname,
    action: redirectResponse ? "REDIRECT" : "PASS",
  });

  return finalResponse;
}
// src/middleware/handlers/auth/index.ts
