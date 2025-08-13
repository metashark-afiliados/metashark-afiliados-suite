// src/middleware.ts
/**
 * @file src/middleware.ts
 * @description Orquestador principal del middleware de Next.js. Este aparato define
 *              el pipeline secuencial de manejadores. Ha sido refactorizado para
 *              consumir la SSoT del `defaultLocale` y para robustecer su `matcher`,
 *              resolviendo la duplicación de logs y la detección incorrecta de idioma.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { defaultLocale } from "@/i18n";
import { logger } from "@/lib/logging";
import { locales, pathnames, localePrefix } from "@/lib/navigation";
import {
  handleAuth,
  handleMaintenance,
  handleMultitenancy,
  handleRedirects,
  handleTelemetry,
} from "@/middleware/handlers";

/**
 * @public
 * @async
 * @function middleware
 * @description Función principal de middleware que orquesta un pipeline de manejadores.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @returns {Promise<NextResponse>} La respuesta final que Next.js servirá.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const startTime = performance.now();
  logger.trace(
    `[MIDDLEWARE_ORCHESTRATOR] Pipeline iniciado para: ${request.nextUrl.pathname}`
  );

  // 1. Redirecciones Canónicas (SEO)
  const redirectsResponse = handleRedirects(request);
  if (redirectsResponse) return redirectsResponse;

  // 2. Modo Mantenimiento
  const maintenanceResponse = handleMaintenance(request);
  if (maintenanceResponse) return maintenanceResponse;

  // 3. Internacionalización
  const handleI18n = createIntlMiddleware({
    locales,
    localePrefix,
    pathnames,
    defaultLocale: defaultLocale, // Consume SSoT
  });
  let response = handleI18n(request);

  const detectedLocale =
    response.headers.get("x-next-intl-locale") || defaultLocale;
  response.headers.set("x-app-locale", detectedLocale);

  // 4. Multi-Tenancy
  response = handleMultitenancy(request, response);

  // 5. Seguridad y Autorización
  response = await handleAuth(request, response);

  // 6. Telemetría (No bloqueante)
  handleTelemetry(request, response);

  const duration = Math.round(performance.now() - startTime);
  logger.info(
    `[MIDDLEWARE_ORCHESTRATOR] Pipeline finalizado para ${request.nextUrl.pathname}`,
    { duration_ms: duration }
  );

  return response;
}

/**
 * @public
 * @constant config
 * @description Configuración del matcher para el middleware de Next.js.
 *              Ha sido optimizado para excluir assets estáticos.
 */
export const config = {
  matcher: [
    "/",
    "/(pt-BR|en-US|es-ES)/:path*",
    "/((?!api|_next/static|_next/image|images|assets|favicon.ico|sw.js).*)",
  ],
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo Centralizado de Errores**: ((Vigente)) Envolver el pipeline en un `try/catch` para reportar errores inesperados a Sentry.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de SSoT**: ((Implementada)) El `createIntlMiddleware` ahora consume la constante `defaultLocale` desde `src/i18n.ts`, eliminando la desincronización y asegurando que `es-ES` sea el idioma por defecto.
 * 2. **Optimización de Ejecución**: ((Implementada)) Se ha mantenido el `matcher` robustecido, previniendo la duplicación de logs de telemetría.
 *
 * =====================================================================
 */
// src/middleware.ts
