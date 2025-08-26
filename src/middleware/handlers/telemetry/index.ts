// src/middleware/handlers/telemetry/index.ts
/**
 * @file src/middleware/handlers/telemetry/index.ts
 * @description Manejador de telemetría de élite. Ha sido blindado para enviar
 *              un token de autenticación secreto, asegurando que solo el
 *              middleware pueda comunicarse con el endpoint de la API de telemetría.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.1.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type NextRequest, type NextResponse } from "next/server";

import { logger } from "@/lib/logging";
import { lookupIpAddress } from "@/lib/services/geoip.service";

async function logVisitToServer(
  payload: object,
  origin: string
): Promise<void> {
  try {
    const secret = process.env.TELEMETRY_API_SECRET;
    if (!secret) {
      logger.warn(
        "[TelemetryHandler] TELEMETRY_API_SECRET no está configurado. La petición no será autenticada."
      );
    }

    logger.trace(
      "[TelemetryHandler] Despachando payload de telemetría al endpoint de API..."
    );
    fetch(`${origin}/api/telemetry-edge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // --- INICIO DE MEJORA DE SEGURIDAD ---
        Authorization: `Bearer ${secret}`,
        // --- FIN DE MEJORA DE SEGURIDAD ---
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    logger.error(
      "[TelemetryHandler] Fallo al enviar la petición fetch al endpoint de telemetría.",
      error
    );
  }
}

export async function handleTelemetry(
  request: NextRequest,
  response: NextResponse
): Promise<void> {
  if (request.cookies.has("metashark_session_id")) {
    return;
  }
  logger.info("[TelemetryHandler] Nuevo visitante detectado, iniciando log.");

  const sessionId = self.crypto.randomUUID();
  const ip = request.ip ?? "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";
  const enrichedGeoData = await lookupIpAddress(ip);

  const logPayload = {
    session_id: sessionId,
    fingerprint: "server_placeholder",
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

  logVisitToServer(logPayload, request.nextUrl.origin);

  response.cookies.set("metashark_session_id", sessionId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 31536000,
  });
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Blindaje de Endpoint:** Se ha añadido el envío de un token `Bearer` secreto, implementando la primera mitad de la solución de seguridad.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Seguimiento de Navegación Intra-Sesión:** El sistema actual solo registra la primera visita. Una mejora de élite sería enviar eventos de "pageview" adicionales al mismo endpoint para rastrear la navegación del usuario dentro de la misma sesión, enriqueciendo los datos de análisis del funnel.
 *
 * =====================================================================
 */
// src/middleware/handlers/telemetry/index.ts
