// src/middleware/handlers/telemetry/index.ts
/**
 * @file src/middleware/handlers/telemetry/index.ts
 * @description Manejador de telemetría para el middleware. Ha sido refactorizado
 *              a un estándar de élite para desacoplarse completamente de Supabase
 *              en el Edge. Ahora envía los datos de telemetría a un endpoint de
 *              API interno (`/api/telemetry-edge`) de forma asíncrona y
 *              no bloqueante ("fire-and-forget").
 * @author Raz Podestá
 * @version 3.0.0
 */
import { type NextRequest, type NextResponse } from "next/server";

import { logger } from "@/lib/logging";
import { lookupIpAddress } from "@/lib/services/geoip.service";

/**
 * @private
 * @async
 * @function logVisitToServer
 * @description Función "fire-and-forget" que envía el payload de telemetría
 *              al endpoint de la API sin esperar una respuesta.
 * @param {object} payload - Los datos del log de visitante a enviar.
 * @param {string} origin - El origen de la petición para construir la URL de la API.
 */
async function logVisitToServer(
  payload: object,
  origin: string
): Promise<void> {
  try {
    // No usamos 'await' aquí. Esta es una operación "fire-and-forget".
    // El middleware no debe esperar a que la telemetría se complete.
    fetch(`${origin}/api/telemetry-edge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    logger.trace(
      "[TelemetryHandler] Payload de telemetría enviado al endpoint de API."
    );
  } catch (error) {
    logger.error(
      "[TelemetryHandler] Fallo al enviar la petición fetch al endpoint de telemetría.",
      error
    );
  }
}

/**
 * @public
 * @async
 * @function handleTelemetry
 * @description Orquesta la recolección de datos en el middleware y dispara el
 *              envío asíncrono al endpoint de la API.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @param {NextResponse} response - La respuesta a modificar con la cookie de sesión.
 */
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
    fingerprint: "server_placeholder", // Será enriquecido por el cliente
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

  // Dispara la llamada a la API pero no la espera.
  logVisitToServer(logPayload, request.nextUrl.origin);

  // Establece la cookie para prevenir logs duplicados en la misma sesión.
  response.cookies.set("metashark_session_id", sessionId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 31536000, // 1 año
  });
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Aislamiento Completo del Edge Runtime**: ((Implementada)) El manejador ya no importa ni utiliza ninguna dependencia de Supabase. Ahora delega la escritura en la base de datos a un endpoint de API que se ejecuta en el runtime de Node.js. Esto elimina por completo la advertencia de build del Edge Runtime.
 * 2. **Rendimiento Mejorado ("Fire-and-Forget")**: ((Implementada)) La llamada `fetch` al endpoint de API no es esperada (`await`). Esto significa que el middleware puede continuar y devolver la respuesta al usuario sin ser bloqueado por la operación de telemetría, reduciendo la latencia.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Fallos de `fetch`**: ((Vigente)) En un escenario de producción de misión crítica, se podría implementar una estrategia de reintentos con "exponential backoff" si la petición `fetch` inicial al endpoint de API falla.
 *
 * =====================================================================
 */
// src/middleware/handlers/telemetry/index.ts
