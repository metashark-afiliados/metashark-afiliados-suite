// src/middleware.ts
/**
 * @file src/middleware.ts
 * @description Orquestador de Middleware de Élite. Refactorizado para implementar
 *              un patrón de "respuesta encadenada" inmutable, resolviendo una
 *              regresión crítica en el Edge Runtime.
 * @author Raz Podestá - MetaShark Tech
 * @version 8.0.0
 * @date 2025-08-31
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

    // --- INICIO DE REFACTORIZACIÓN: PATRÓN DE RESPUESTA ENCADENADA ---
    let response = NextResponse.next({
      request: { headers: new Headers(request.headers) },
    });

    response = await withPerformanceLogging("I18n", handleI18n, request);

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
    // handleTelemetry puede mutar la response (añadir cookies) pero no necesita devolverla
    // ya que es el último en la cadena principal.
    await withPerformanceLogging(
      "Telemetry",
      handleTelemetry,
      request,
      response
    );
    // --- FIN DE REFACTORIZACIÓN ---

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
    const url = request.nextUrl.clone();
    url.pathname = "/500"; // Redirigir a una página de error estática o simple
    url.search = `?errorId=${errorId}`;
    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
// src/middleware.ts
