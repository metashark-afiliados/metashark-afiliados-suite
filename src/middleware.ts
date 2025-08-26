// src/middleware.ts
/**
 * @file src/middleware.ts
 * @description Orquestador de Middleware de Élite. Refactorizado para ser
 *              completamente asíncrono y manejar correctamente las promesas
 *              devueltas por sus handlers, resolviendo regresiones de tipo.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type NextRequest, type NextResponse } from "next/server";

import { logger } from "@/lib/logging";
import {
  handleAuth,
  handleI18n,
  handleMaintenance,
  handleMultitenancy,
  handleRedirects,
  handleTelemetry,
} from "@/middleware/handlers";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  logger.trace("==> [MIDDLEWARE_PIPELINE] START <==", {
    path: request.nextUrl.pathname,
  });

  const redirectResponse = handleRedirects(request);
  if (redirectResponse) return redirectResponse;

  const maintenanceResponse = handleMaintenance(request);
  if (maintenanceResponse) return maintenanceResponse;

  // --- INICIO DE CORRECCIÓN ASÍNCRONA HOLÍSTICA ---
  // Se espera (await) la resolución de cada handler asíncrono en la cadena.
  let response = await handleI18n(request);
  response = await handleMultitenancy(request, response);
  response = await handleAuth(request, response);
  await handleTelemetry(request, response);
  // --- FIN DE CORRECCIÓN ASÍNCRONA HOLÍSTICA ---

  logger.trace("==> [MIDDLEWARE_PIPELINE] END <==", {
    path: request.nextUrl.pathname,
    status: response.status,
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
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Resolución de Regresión Asíncrona:** Se ha añadido `await` a las llamadas de `handleMultitenancy`, `handleAuth` y `handleTelemetry`, resolviendo la cascada de errores de tipo (`TS2740`, `TS2345`, `TS2339`) y restaurando la integridad del pipeline.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Composición de Middlewares con Factoría:** Para una escalabilidad de élite, se podría crear una función `createMiddlewarePipeline([...handlers])` que genere la función `middleware` a partir de un array de manejadores.
 *
 * =====================================================================
 */
// src/middleware.ts
