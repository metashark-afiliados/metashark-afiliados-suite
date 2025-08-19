// src/middleware/handlers/auth/index.ts
/**
 * @file src/middleware/handlers/auth/index.ts
 * @description Motor de reglas de autorización de élite para el middleware.
 *              Ha sido refactorizado para consumir sus dependencias desde el
 *              directorio aislado `src/middleware/lib/`, garantizando la
 *              compatibilidad con el Edge Runtime y resolviendo la advertencia de build.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logging";
// --- INICIO DE CORRECCIÓN DE IMPORTACIONES ---
import {
  getAuthDataForMiddleware,
  type UserAuthData,
} from "@/middleware/lib/permissions-edge";
import {
  ROUTE_MANIFEST,
  type RouteSecurityRule,
} from "@/middleware/lib/routing-manifest-edge";
// --- FIN DE CORRECCIÓN DE IMPORTACIONES ---

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
 * 1. **Aislamiento de Runtime Completo**: ((Implementada)) Al actualizar las importaciones para que apunten a `src/middleware/lib/`, este manejador y toda su cadena de dependencias quedan completamente aislados del código del runtime de Node.js, resolviendo la advertencia de Vercel y cumpliendo con las mejores prácticas del Edge.
 *
 * =====================================================================
 */
// src/middleware/handlers/auth/index.ts
