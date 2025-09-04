// src/middleware.ts
/**
 * @file src/middleware.ts
 * @description Orquestador de Middleware de Élite. Implementa un patrón de
 *              "Pipeline Declarativo" para una ejecución secuencial, observable
 *              y resiliente de manejadores atómicos.
 * @author L.I.A. Legacy
 * @version 10.0.0
 * @see .docs-espejo/middleware.ts.md
 */
import { type NextRequest, NextResponse } from "next/server";

import { withCorrelationId } from "@/lib/helpers/correlation-id.helper";
import { logger } from "@/lib/logger";
import {
  handleAuth,
  handleI18n,
  handleMaintenance,
  handleMultitenancy,
  handleRedirects,
  handleTelemetry,
} from "@/middleware/handlers";

type MiddlewareHandler = (
  request: NextRequest,
  response: NextResponse
) => Promise<NextResponse>;

/**
 * @private
 * @async
 * @function createMiddlewarePipeline
 * @description Factoría que crea y ejecuta un pipeline de manejadores de middleware.
 * @param {NextRequest} request - La petición entrante.
 * @param {Array<{ name: string; handler: MiddlewareHandler }>} handlers - Array de manejadores a ejecutar.
 * @returns {Promise<NextResponse>} La respuesta final del pipeline.
 */
async function createMiddlewarePipeline(
  request: NextRequest,
  handlers: Array<{ name: string; handler: MiddlewareHandler }>
): Promise<NextResponse> {
  let response = NextResponse.next({
    request: { headers: new Headers(request.headers) },
  });
  const { pathname } = request.nextUrl;

  for (const { name, handler } of handlers) {
    const startTime = performance.now();
    try {
      const result = await handler(request, response);
      if (result) {
        response = result;
      }
      // Si un handler devuelve una redirección, detenemos el pipeline.
      if (response.status >= 300 && response.status < 400) {
        logger.trace(
          { handler: name, status: response.status },
          "[Pipeline] Redirección emitida. Finalizando pipeline."
        );
        return response;
      }
    } catch (error) {
      logger.error(
        { err: error, handler: name },
        `[Pipeline] Fallo crítico en manejador.`
      );
      // En caso de error en un handler, podemos decidir si continuar o abortar.
      // Por resiliencia, continuamos, pero registramos el error.
    } finally {
      const duration = parseFloat((performance.now() - startTime).toFixed(2));
      logger.trace(
        { handler: name, duration_ms: duration },
        `[Pipeline] Manejador ejecutado.`
      );
    }
  }
  return response;
}

/**
 * @private
 * @async
 * @function middlewarePipeline
 * @description Define y ejecuta el pipeline de middleware para cada petición.
 * @param {NextRequest} request - La petición entrante.
 * @returns {Promise<NextResponse>} La respuesta final.
 */
async function middlewarePipeline(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  logger.trace({ path: pathname }, "==> [MIDDLEWARE_PIPELINE] INICIO <==");
  const pipelineStartTime = performance.now();

  try {
    // Manejadores que pueden retornar una respuesta final y detener el pipeline
    const redirectResponse = handleRedirects(request);
    if (redirectResponse) return redirectResponse;

    const maintenanceResponse = handleMaintenance(request);
    if (maintenanceResponse) return maintenanceResponse;

    // Pipeline principal de manejadores encadenados
    const response = await createMiddlewarePipeline(request, [
      { name: "I18n", handler: handleI18n },
      { name: "Multitenancy", handler: handleMultitenancy },
      { name: "Auth", handler: handleAuth },
      {
        name: "Telemetry",
        handler: (req, res) => {
          handleTelemetry(req, res);
          return Promise.resolve(res);
        },
      },
    ]);

    const totalDuration = parseFloat(
      (performance.now() - pipelineStartTime).toFixed(2)
    );
    logger.info(
      { path: pathname, duration_ms: totalDuration },
      "[PERF] Pipeline completo ejecutado."
    );
    logger.trace({ path: pathname }, "==> [MIDDLEWARE_PIPELINE] FIN <==");

    return response;
  } catch (error) {
    const errorId = `mw-err-${Date.now()}`;
    logger.error(
      { err: error, errorId, path: pathname },
      `[MIDDLEWARE_PIPELINE] FALLO CRÍTICO.`
    );
    const url = request.nextUrl.clone();
    url.pathname = "/500";
    url.search = `?errorId=${errorId}`;
    return NextResponse.rewrite(url);
  }
}

/**
 * @public
 * @function middleware
 * @description El punto de entrada principal del middleware. Envuelve el pipeline en `withCorrelationId`.
 * @param {NextRequest} request - La petición entrante.
 * @returns {Promise<NextResponse>} El objeto de respuesta final.
 */
export function middleware(request: NextRequest): Promise<NextResponse> {
  return withCorrelationId(() => middlewarePipeline(request));
}

/**
 * @public
 * @constant config
 * @description Configuración del matcher para el middleware.
 */
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas de petición excepto las que probablemente
     * sean para activos estáticos.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
// src/middleware.ts
