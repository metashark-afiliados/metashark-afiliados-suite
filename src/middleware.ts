// src/middleware.ts
/**
 * @file src/middleware.ts
 * @description Orquestador de middleware de élite. Reconstruido para ejecutar
 *              un pipeline de manejadores secuenciales, restaurando la lógica
 *              de enrutamiento y resolviendo el error 404.
 * @author L.I.A. Legacy
 * @version 3.0.0
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

export async function middleware(request: NextRequest) {
  const startTime = performance.now();
  logger.trace(
    `[MIDDLEWARE] Pipeline starting for: ${request.nextUrl.pathname}`
  );

  // 1. Redirecciones Canónicas (SEO)
  const redirectResponse = handleRedirects(request);
  if (redirectResponse) return redirectResponse;

  // 2. Modo Mantenimiento
  const maintenanceResponse = handleMaintenance(request);
  if (maintenanceResponse) return maintenanceResponse;

  // 3. Internacionalización
  let response = handleI18n(request);

  // 4. Multi-Tenancy (Reescritura de Subdominios)
  response = handleMultitenancy(request, response);

  // 5. Seguridad y Autorización
  response = await handleAuth(request, response);

  // 6. Telemetría (Ejecución asíncrona no bloqueante)
  handleTelemetry(request, response);

  const duration = Math.round(performance.now() - startTime);
  logger.trace(
    `[MIDDLEWARE] Pipeline finished for ${request.nextUrl.pathname}`,
    { duration_ms: duration }
  );

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
