// src/middleware.ts
/**
 * @file src/middleware.ts
 * @description Orquestador de Middleware de Élite. Implementa un patrón de
 *              "respuesta encadenada" inmutable para garantizar la integridad
 *              de la petición y la respuesta a través de un pipeline de
 *              manejadores secuenciales y observables.
 * @author L.I.A. Legacy
 * @copilot RaZ WriTe
 * @version 8.1.0
 * @see .docs-espejo/middleware.ts.md
 */
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import {
  handleAuth,
  handleI18n,
  handleMaintenance,
  handleMultitenancy,
  handleRedirects,
  handleTelemetry,
} from "@/middleware/handlers";

async function withPerformanceLogging<
  T extends (...args: any[]) => Promise<any>,
>(name: string, handler: T, ...args: Parameters<T>): Promise<ReturnType<T>> {
  const startTime = performance.now();
  const result = await handler(...args);
  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);
  logger.trace(
    { duration_ms: parseFloat(duration) },
    `[PERF] Handler '${name}' ejecutado.`
  );
  return result;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  logger.trace({ path: pathname }, "==> [MIDDLEWARE_PIPELINE] INICIO <==");
  const pipelineStartTime = performance.now();

  try {
    const redirectResponse = handleRedirects(request);
    if (redirectResponse) return redirectResponse;

    const maintenanceResponse = handleMaintenance(request);
    if (maintenanceResponse) return maintenanceResponse;

    // --- INICIO DE REFACTORIZACIÓN: PATRÓN DE RESPUESTA ENCADENADA ---
    let response = await withPerformanceLogging("I18n", handleI18n, request);

    const detectedLocale = response.headers.get("x-app-locale") || "N/A";

    response = await withPerformanceLogging(
      "Multitenancy",
      handleMultitenancy,
      request,
      response
    );
    response = await withPerformanceLogging(
      "Auth",
      handleAuth,
      request,
      response
    );

    // handleTelemetry puede mutar la response (añadir cookies) pero es el último.
    await withPerformanceLogging(
      "Telemetry",
      handleTelemetry,
      request,
      response
    );
    // --- FIN DE REFACTORIZACIÓN ---

    const pipelineEndTime = performance.now();
    const totalDuration = (pipelineEndTime - pipelineStartTime).toFixed(2);
    logger.info(
      {
        path: pathname,
        locale: detectedLocale,
        duration_ms: parseFloat(totalDuration),
      },
      "[PERF] Pipeline completo ejecutado."
    );

    logger.trace({ path: pathname }, "==> [MIDDLEWARE_PIPELINE] FIN <==");
    return response;
  } catch (error) {
    const errorId = `mw-err-${Date.now()}`;
    logger.error(
      {
        errorId,
        path: pathname,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      `[MIDDLEWARE_PIPELINE] FALLO CRÍTICO IRRECUPERABLE.`
    );
    const url = request.nextUrl.clone();
    url.pathname = "/500";
    url.search = `?errorId=${errorId}`;
    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
// src/middleware.ts
