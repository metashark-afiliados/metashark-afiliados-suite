// src/middleware.ts
/**
 * @file src/middleware.ts
 * @description Orquestador de Middleware de Élite. Refactorizado para
 *              garantizar la compatibilidad con el Edge Runtime, mejorar la
 *              observabilidad y añadir documentación de nivel de producción.
 * @author Raz Podestá - MetaShark Tech
 * @version 7.0.0
 * @date 2025-08-31
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
 * @param {T} handler - La función del handler a ejecutar.
 * @param {Parameters<T>} args - Los argumentos a pasar al handler.
 * @returns {Promise<ReturnType<T>>} El resultado del handler.
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

/**
 * @public
 * @middleware
 * @description Punto de entrada principal para el middleware de Next.js. Orquesta
 *              la ejecución secuencial de todos los manejadores.
 * @param {NextRequest} request - La petición entrante.
 * @returns {Promise<NextResponse>} La respuesta final, ya sea una redirección,
 *          una reescritura o la respuesta original modificada.
 */
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
    
    // Enriquecer el log con el locale detectado
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
      locale: detectedLocale,
    });

    logger.trace("==> [MIDDLEWARE_PIPELINE] END <==", { path: pathname });
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
    // Devuelve una respuesta de error genérica para el usuario.
    // El ID de error permite correlacionar el incidente en los logs.
    return new NextResponse(
      `Internal Server Error. Please report this issue with ID: ${errorId}`,
      { status: 500 }
    );
  }
}

/**
 * @public
 * @config
 * @description Configuración del matcher para el middleware. Excluye rutas de API,
 *              assets estáticos y archivos internos de Next.js.
 */
export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
// src/middleware.ts