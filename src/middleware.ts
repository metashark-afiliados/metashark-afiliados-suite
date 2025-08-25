// src/middleware.ts
/**
 * @file src/middleware.ts
 * @description Orquestador principal del middleware. Corregido para exportar la
 *              función principal por defecto, cumpliendo con el contrato de API de Next.js.
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import { defaultLocale } from "@/i18n";
import { logger } from "@/lib/logging";
import { localePrefix, locales, pathnames } from "@/lib/navigation";
import {
  handleAuth,
  handleMaintenance,
  handleMultitenancy,
  handleRedirects,
  handleTelemetry,
} from "@/middleware/handlers";

async function middlewarePipeline(request: NextRequest): Promise<NextResponse> {
  const startTime = performance.now();
  logger.trace(
    `[MIDDLEWARE_ORCHESTRATOR] Pipeline iniciado para: ${request.nextUrl.pathname}`
  );

  const redirectsResponse = handleRedirects(request);
  if (redirectsResponse) return redirectsResponse;

  const maintenanceResponse = handleMaintenance(request);
  if (maintenanceResponse) return maintenanceResponse;

  const handleI18n = createIntlMiddleware({
    locales,
    localePrefix,
    pathnames,
    defaultLocale: defaultLocale,
  });
  let response = handleI18n(request);

  const detectedLocale =
    response.headers.get("x-next-intl-locale") || defaultLocale;
  response.headers.set("x-app-locale", detectedLocale);

  response = handleMultitenancy(request, response);
  response = await handleAuth(request, response);
  handleTelemetry(request, response);

  const duration = Math.round(performance.now() - startTime);
  logger.info(
    `[MIDDLEWARE_ORCHESTRATOR] Pipeline finalizado para ${request.nextUrl.pathname}`,
    { duration_ms: duration }
  );

  return response;
}

// --- INICIO DE CORRECCIÓN: EXPORTACIÓN POR DEFECTO ---
export default middlewarePipeline;
// --- FIN DE CORRECCIÓN ---

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
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Servidor**: ((Implementada)) Se ha añadido la exportación por defecto, resolviendo el error de "must export a `middleware` or a `default` function".
 * 2. **Legibilidad Mejorada**: ((Implementada)) La lógica ha sido encapsulada en una función `middlewarePipeline` nombrada, mejorando la claridad del código antes de la exportación.
 *
 * =====================================================================
 */
// src/middleware.ts
