// src/middleware/handlers/telemetry/index.ts
/**
 * @file src/middleware/handlers/telemetry/index.ts
 * @description Manejador de middleware para la inteligencia de visitante. Inicia
 *              el registro de una nueva sesión de visitante en el primer contacto,
 *              enriqueciendo los datos con información del servidor (IP, Geo, UTMs)
 *              y estableciendo una cookie de sesión para su posterior enriquecimiento
 *              por parte del cliente.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { type NextRequest, type NextResponse } from "next/server";
import { ZodError } from "zod";

import { logger } from "@/lib/logging";
import { lookupIpAddress } from "@/lib/services/geoip.service";
import { createClient } from "@/lib/supabase/middleware";
import { VisitorLogSchema } from "@/lib/validators";

/**
 * @public
 * @async
 * @function handleTelemetry
 * @description Si no existe una cookie de sesión, crea un nuevo registro de `visitor_logs`.
 *              Esta operación es "fire-and-forget" y no bloquea el pipeline; no
 *              devuelve una respuesta, sino que modifica la `response` entrante
 *              añadiendo una cookie.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @param {NextResponse} response - La respuesta a modificar.
 */
export async function handleTelemetry(
  request: NextRequest,
  response: NextResponse
): Promise<void> {
  // Si ya hemos registrado esta sesión, no hacer nada.
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
      fingerprint: "server_placeholder", // Será enriquecido por el cliente
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
      is_known_abuser: false, // Lógica de lista negra a implementar
    };

    const validatedPayload = VisitorLogSchema.parse(logPayload);
    const { supabase } = await createClient(request);
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
 * @subsection Melhorias Futuras
 * 1. **Lista Negra de IPs**: ((Vigente)) Implementar una lógica `checkIpBlacklist` que consulte una lista de IPs (desde una variable de entorno o una tabla) y establezca `is_known_abuser` en `true` si hay una coincidencia.
 * 2. **Enriquecimiento de `user_id`**: ((Vigente)) Después de la autenticación, una Server Action podría actualizar el `visitor_log` de esta sesión para asociarlo con el `user_id`, conectando la actividad anónima con un usuario registrado.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Inicio de Telemetría**: ((Implementada)) Este aparato restaura el sistema de seguimiento de visitantes anónimos, una capacidad fundamental para la analítica de marketing.
 * 2. **Enriquecimiento de Datos en el Edge**: ((Implementada)) La lógica enriquece los datos de la sesión con información de GeoIP y parámetros UTM directamente en el middleware, asegurando que los datos se capturen incluso si el usuario no interactúa con el JavaScript del cliente.
 * 3. **Validación de Contrato con Zod**: ((Implementada)) El payload se valida rigurosamente con `VisitorLogSchema` antes de la inserción, garantizando la integridad de los datos de telemetría.
 *
 * =====================================================================
 */
// src/middleware/handlers/telemetry/index.ts
