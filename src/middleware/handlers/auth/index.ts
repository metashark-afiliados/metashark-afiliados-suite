// src/middleware/handlers/auth/index.ts
/**
 * @file src/middleware/handlers/auth/index.ts
 * @description Motor de reglas de autorización. Actualizado para reconocer
 *              sesiones simuladas en modo de desarrollo, rompiendo el bucle
 *              de redirección de autenticación.
 * @author L.I.A. Legacy
 * @version 3.0.0
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

function handleAuthenticated(
  request: NextRequest,
  authData: UserAuthData | { isDevMock: true },
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

  // Solo se valida el rol para usuarios reales, no para el mock.
  if (
    !("isDevMock" in authData) &&
    rule.classification === "protected" &&
    rule.requiredRoles
  ) {
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

export async function handleAuth(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  logger.trace("==> [AUTH_HANDLER] START <==", { path: pathname });

  const isDevMode = process.env.DEV_MODE_ENABLED === "true";
  let authData: UserAuthData | { isDevMock: true } | null = null;

  // --- LÓGICA DE MODO DESARROLLADOR ---
  if (isDevMode && request.cookies.has("dev_session")) {
    logger.trace("[AUTH_HANDLER:DevMock] Sesión simulada detectada.");
    authData = { isDevMock: true };
  } else {
    authData = await getAuthDataForMiddleware(request, response);
  }

  const locale = response.headers.get("x-app-locale") || "pt-BR";
  const pathnameWithoutLocale =
    pathname.replace(new RegExp(`^/${locale}`), "") || "/";

  let rule = findMatchingRouteRule(pathnameWithoutLocale);

  if (!rule) {
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

  return redirectResponse || response;
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Soporte para Sesión Simulada**: ((Implementada)) El manejador ahora detecta la cookie `dev_session` en modo de desarrollo y simula una sesión autenticada, rompiendo el bucle de redirección y permitiendo el acceso al dashboard.
 * 2. **Tipado Robusto**: ((Implementada)) Se ha actualizado el tipo del parámetro `authData` en `handleAuthenticated` para aceptar tanto un `UserAuthData` real como un objeto de mock, manteniendo la seguridad de tipos.
 *
 */
// src/middleware/handlers/auth/index.ts
