// src/middleware/handlers/auth/index.ts
/**
 * @file src/middleware/handlers/auth/index.ts
 * @description Motor de reglas de autorización de élite para el middleware.
 *              Implementa un patrón de "respuesta encadenada" para garantizar
 *              la integridad de la sesión y las cookies a través del pipeline.
 * @author L.I.A. Legacy
 * @copilot RaZ WriTe
 * @version 8.0.0
 * @see .docs-espejo/middleware/handlers/auth/index.md
 */
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logger";
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
      { from: pathname, to: `/${locale}/login` },
      "[AUTH_HANDLER] Usuario no autenticado en ruta protegida. Redirigiendo a login."
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
      { from: pathname, userId: authData.user.id },
      "[AUTH_HANDLER] Usuario autenticado en ruta de autenticación. Redirigiendo a dashboard."
    );
    return createRedirectResponse(request, locale, "/dashboard");
  }

  if (rule.classification === "protected" && rule.requiredRoles) {
    if (!rule.requiredRoles.includes(authData.appRole)) {
      logger.warn(
        {
          userId: authData.user.id,
          role: authData.appRole,
          required: rule.requiredRoles,
          path: pathname,
        },
        "[AUTH_HANDLER] VIOLACIÓN DE PERMISOS: Acceso denegado a la ruta."
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
  logger.trace({ path: pathname }, "==> [AUTH_HANDLER] INICIO <==");

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

  logger.trace(
    { path: pathname, action: redirectResponse ? "REDIRECT" : "PASS" },
    "==> [AUTH_HANDLER] FIN <=="
  );

  return finalResponse;
}
// src/middleware/handlers/auth/index.ts
