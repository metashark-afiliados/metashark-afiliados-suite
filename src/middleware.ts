// src/middleware.ts
/**
 * @file src/middleware.ts
 * @description Orquestador de Middleware de Élite. Refactorizado para ser
 *              completamente asíncrono y manejar correctamente el encadenamiento
 *              de promesas y la propagación inmutable de objetos de respuesta
 *              a través de sus handlers, resolviendo la causa raíz del fallo
 *              de despliegue en Vercel.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-29
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
 * @public
 * @async
 * @function middleware
 * @description Punto de entrada principal para el middleware de la aplicación.
 *              Ejecuta una cadena de manejadores en un orden específico.
 * @param {NextRequest} request - La petición entrante.
 * @returns {Promise<NextResponse>} La respuesta final modificada.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  logger.trace("==> [MIDDLEWARE_PIPELINE] START <==", {
    path: request.nextUrl.pathname,
  });

  // --- Handlers Síncronos (Early Exit) ---
  const redirectResponse = handleRedirects(request);
  if (redirectResponse) return redirectResponse;

  const maintenanceResponse = handleMaintenance(request);
  if (maintenanceResponse) return maintenanceResponse;

  // --- Pipeline de Handlers Asíncronos Encadenados ---
  // Cada handler asíncrono recibe la petición y la respuesta del handler anterior.
  let response = await handleI18n(request);
  response = await handleMultitenancy(request, response);
  response = await handleAuth(request, response);

  // handleTelemetry es "fire-and-forget" y no necesita modificar la respuesta,
  // pero se le pasa para que tenga acceso a headers como x-app-locale si es necesario.
  await handleTelemetry(request, response);

  logger.trace("==> [MIDDLEWARE_PIPELINE] END <==", {
    path: request.nextUrl.pathname,
    finalStatus: response.status,
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Factoría de Pipeline de Middlewares**: Para una escalabilidad de élite y un código más declarativo, la lógica de encadenamiento podría ser abstraída a una función `createMiddlewarePipeline([...handlers])`. Esta factoría recibiría un array de handlers y devolvería la función `middleware` final, gestionando automáticamente la propagación del objeto `response`.
 * 2. **Logging de Rendimiento por Handler**: Implementar un wrapper para cada handler que mida su tiempo de ejecución (`performance.now()`). Esto permitiría identificar cuellos de botella en el pipeline del middleware y optimizar el rendimiento.
 * 3. **Gestión de Errores Centralizada**: Envolver el pipeline completo en un bloque `try/catch` para capturar cualquier error inesperado de los handlers. Esto permitiría registrar un error persistente y devolver una página de error genérica (`/_error`), mejorando la resiliencia.
 * 4. **Configuración de Matcher Dinámica**: El `matcher` de la configuración podría ser generado dinámicamente a partir de una lista de rutas públicas y protegidas en el `ROUTE_MANIFEST` para una sincronización más robusta.
 * =====================================================================
 */
// src/middleware.ts
