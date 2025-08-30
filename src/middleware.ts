// src/middleware.ts
/**
 * @file src/middleware.ts
 * @description Orquestador de Middleware de Élite. Ha sido refactorizado
 *              holísticamente a un estándar de producción, eliminando la
 *              dependencia de APIs de Node.js ('perf_hooks') para garantizar
 *              la compatibilidad con el Edge Runtime.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
 * @date 2025-08-30
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logging";
import {
  handleAuth,
  handleI18n,
  handleMaintenance,
  handleMultitenancy,
  handleRedirects,
  handleTelemetry,
} from "@/middleware/handlers";

/**
 * @private
 * @async
 * @function withPerformanceLogging
 * @description Wrapper de alto orden que mide y registra el tiempo de ejecución
 *              de un handler de middleware asíncrono.
 * @param {string} name - El nombre del handler para el logging.
 * @param {Function} handler - La función del handler a ejecutar.
 * @param {any[]} args - Los argumentos a pasar al handler.
 * @returns {Promise<any>} El resultado del handler.
 */
async function withPerformanceLogging<
  T extends (...args: any[]) => Promise<any>,
>(name: string, handler: T, ...args: Parameters<T>): Promise<ReturnType<T>> {
  const startTime = performance.now();
  const result = await handler(...args);
  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);
  logger.trace(`[PERF] Handler '${name}' ejecutado en ${duration}ms.`);
  return result;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  logger.trace("==> [MIDDLEWARE_PIPELINE] START <==", { path: pathname });
  const pipelineStartTime = performance.now();

  try {
    const redirectResponse = handleRedirects(request);
    if (redirectResponse) return redirectResponse;

    const maintenanceResponse = handleMaintenance(request);
    if (maintenanceResponse) return maintenanceResponse;

    let response = await withPerformanceLogging("I18n", handleI18n, request);
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
    await withPerformanceLogging(
      "Telemetry",
      handleTelemetry,
      request,
      response
    );

    const pipelineEndTime = performance.now();
    const totalDuration = (pipelineEndTime - pipelineStartTime).toFixed(2);
    logger.info(`[PERF] Pipeline completo ejecutado en ${totalDuration}ms.`, {
      path: pathname,
    });

    return response;
  } catch (error) {
    const errorId = `mw-err-${Date.now()}`;
    logger.error(
      `[MIDDLEWARE_PIPELINE] FALLO CRÍTICO IRRECUPERABLE. Error ID: ${errorId}`,
      {
        path: pathname,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      }
    );
    return new NextResponse(
      `Internal Server Error. Please report this issue with ID: ${errorId}`,
      { status: 500 }
    );
  }
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
// src/middleware.ts
