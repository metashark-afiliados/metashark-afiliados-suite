// src/middleware/handlers/telemetry/index.ts
/**
 * @file src/middleware/handlers/telemetry/index.ts
 * @description Manejador de telemetría de élite. Ha sido refactorizado para
 *              eliminar el anti-patrón de "petición a sí mismo" y para enviar
 *              únicamente datos veraces del servidor, delegando el enriquecimiento
 *              al cliente.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-30
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type NextRequest, type NextResponse } from "next/server";

import { telemetry } from "@/lib/actions";
import { logger } from "@/lib/logging";
import { lookupIpAddress } from "@/lib/services/geoip.service";

/**
 * @public
 * @async
 * @function handleTelemetry
 * @description Orquesta la recolección de datos de telemetría en la primera visita
 *              y los persiste directamente invocando la Server Action `logVisitorAction`.
 *              Es un proceso "fire-and-forget" que no bloquea el pipeline.
 * @param {NextRequest} request - La petición entrante.
 * @param {NextResponse} response - El objeto de respuesta actual en el pipeline.
 * @returns {Promise<void>}
 */
export async function handleTelemetry(
  request: NextRequest,
  response: NextResponse
): Promise<void> {
  if (request.cookies.has("metashark_session_id")) {
    return;
  }
  logger.info("[TelemetryHandler] Nuevo visitante detectado, iniciando log.");

  const sessionId = crypto.randomUUID();
  const ip = request.ip ?? "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";
  const enrichedGeoData = await lookupIpAddress(ip);

  const logPayload = {
    session_id: sessionId,
    ip_address: ip,
    geo_data: enrichedGeoData
      ? { ...request.geo, ...enrichedGeoData }
      : request.geo,
    user_agent: userAgent,
    utm_params: Object.fromEntries(request.nextUrl.searchParams.entries()),
    referrer: request.headers.get("referer") || null,
    landing_page: request.nextUrl.pathname,
    is_bot: /bot|crawl|slurp|spider|mediapartners/i.test(userAgent),
  };

  telemetry.logVisitorAction(logPayload).catch((error) => {
    logger.error(
      "[TelemetryHandler] Fallo en la ejecución en segundo plano de logVisitorAction.",
      error
    );
  });

  response.cookies.set("metashark_session_id", sessionId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 31536000, // 1 año
  });
}
// src/middleware/handlers/telemetry/index.ts
