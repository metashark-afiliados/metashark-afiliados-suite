// src/middleware/handlers/telemetry/index.ts
/**
 * @file src/middleware/handlers/telemetry/index.ts
 * @description Manejador de telemetría, refactorizado para consumir el cliente
 *              Supabase específico del Edge, garantizando su compatibilidad
 *              y aislamiento de runtime.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { type NextRequest, type NextResponse } from "next/server";
import { ZodError } from "zod";

import { logger } from "@/lib/logging";
import { lookupIpAddress } from "@/lib/services/geoip.service";
import { VisitorLogSchema } from "@/lib/validators";
import { createEdgeClient } from "@/middleware/lib/supabase-edge.client";

/**
 * @public
 * @async
 * @function handleTelemetry
 * @description Si no existe una cookie de sesión, crea un nuevo registro de `visitor_logs`.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @param {NextResponse} response - La respuesta a modificar.
 */
export async function handleTelemetry(
  request: NextRequest,
  response: NextResponse
): Promise<void> {
  if (request.cookies.has("metashark_session_id")) {
    logger.trace(
      "[TelemetryHandler] Omitiendo log, la cookie de sesión ya existe."
    );
    return;
  }
  logger.info("[TelemetryHandler] Nuevo visitante detectado, iniciando log.");

  try {
    const sessionId = self.crypto.randomUUID();
    const ip = request.ip ?? "127.0.0.1";
    const enrichedGeoData = await lookupIpAddress(ip);

    const logPayload = {
      session_id: sessionId,
      fingerprint: "server_placeholder",
      ip_address: ip,
      geo_data: enrichedGeoData
        ? { ...request.geo, ...enrichedGeoData }
        : request.geo,
      user_agent: request.headers.get("user-agent") || null,
      utm_params: Object.fromEntries(request.nextUrl.searchParams.entries()),
      referrer: request.headers.get("referer") || null,
      landing_page: request.nextUrl.pathname,
      is_bot: /bot|crawl|slurp|spider|mediapartners/i.test(
        request.headers.get("user-agent") || ""
      ),
      is_known_abuser: false,
    };

    const validatedPayload = VisitorLogSchema.parse(logPayload);
    const supabase = createEdgeClient(request, response);
    const { error } = await supabase
      .from("visitor_logs")
      .insert(validatedPayload);

    if (error) {
      logger.error("[TelemetryHandler] Fallo al registrar la sesión.", {
        error: error.message,
      });
    } else {
      logger.info(
        "[TelemetryHandler] Sesión de visitante registrada con éxito.",
        { sessionId }
      );
      response.cookies.set("metashark_session_id", sessionId, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 31536000, // 1 año
      });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("[TelemetryHandler] Payload de log de visitante inválido.", {
        errors: error.flatten(),
      });
    } else {
      logger.error(
        "[TelemetryHandler] Fallo crítico en el manejador de telemetría.",
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Aislamiento de Runtime Completo**: ((Implementada)) Al actualizar la importación para usar `createEdgeClient`, este manejador queda completamente aislado y es seguro para el Edge.
 *
 */
// src/middleware/handlers/telemetry/index.ts
