// src/middleware/handlers/auth/index.ts
/**
 * @file src/middleware/handlers/auth/index.ts
 * @description Motor de reglas de autorización de élite para el middleware.
 *              Ha sido refactorizado holísticamente para consumir la nueva API de
 *              `getAuthDataForMiddleware`, garantizando que el objeto `response`
 *              con las cookies de sesión actualizadas se propague correctamente
 *              a través del pipeline y resolviendo el error 500 de Vercel.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
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
    const loginUrl = new URL(`/${locale}/login`, request.nextUrl.origin);
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

export async function handleAuth(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  logger.trace("==> [AUTH_HANDLER] START <==", { path: pathname });

  if (process.env.DEV_MODE_AUTH_BYPASS === "true") {
    logger.warn(
      "[AUTH_HANDLER] MODO BYPASS ACTIVO. Se omitirá toda la lógica de autenticación y autorización."
    );
    return response;
  }

  // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA (Flujo de Response) ---
  const { authData, response: supabaseResponse } =
    await getAuthDataForMiddleware(request);
  // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---

  const locale =
    supabaseResponse.headers.get("x-app-locale") ||
    response.headers.get("x-app-locale") ||
    "pt-BR";
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

  return redirectResponse || supabaseResponse;
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Futuras
 * 1. **Manifiesto de Bypass en `.env.example`**: Actualizar el archivo `.env.example` para incluir la variable `DEV_MODE_AUTH_BYPASS=false` y una descripción de su propósito para mejorar la DX de nuevos desarrolladores.
 * 2. **Factoría de Reglas de Ruta**: La función `findMatchingRouteRule` podría ser optimizada para manejar rutas con parámetros dinámicos si fuera necesario en el futuro, utilizando una lógica de coincidencia de patrones más avanzada.
 * 3. **Logging de Headers**: Para una depuración más profunda, el log de `[AUTH_HANDLER] END` podría incluir las cabeceras (`headers`) de la respuesta final para verificar la correcta propagación de cookies y otras cabeceras.
 * =====================================================================
 */
