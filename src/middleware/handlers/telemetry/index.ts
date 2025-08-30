// src/middleware/handlers/telemetry/index.ts
/**
 * @file src/middleware/handlers/telemetry/index.ts
 * @description Manejador de telemetría de élite. Ha sido refactorizado holísticamente
 *              para eliminar el anti-patrón de "petición a sí mismo". Ahora invoca
 *              directamente la Server Action `logVisitorAction`, resolviendo el
 *              deadlock arquitectónico que causaba el fallo del middleware.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-29
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
  // Si la cookie de sesión ya existe, el log inicial ya se realizó.
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
    fingerprint: "server_placeholder", // El cliente enriquecerá esto después.
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

  // Se invoca la Server Action directamente en lugar de usar fetch.
  // No usamos `await` para que no bloquee el pipeline del middleware (fire-and-forget).
  telemetry.logVisitorAction(logPayload).catch((error) => {
    logger.error(
      "[TelemetryHandler] Fallo en la ejecución en segundo plano de logVisitorAction.",
      error
    );
  });

  // Se establece la cookie para prevenir logs duplicados en peticiones subsecuentes.
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
 * @subsection Melhorias Futuras
 * 1. **Manejo de `userId` en Middleware**: El `logPayload` actual no incluye `userId`. Para asociar la sesión con un usuario desde la primera visita (si ya está logueado), este handler necesitaría acceso a `authData`, lo que requeriría reordenarlo después del `handleAuth` en el pipeline de `middleware.ts`.
 * 2. **Exclusión de Rutas de Assets**: El handler se ejecuta para todas las rutas. Podría ser optimizado para excluir rutas de assets (`_next/`, `favicon.ico`) añadiendo una guarda al principio, reduciendo ejecuciones innecesarias.
 * 3. **Configuración de `maxAge` de Cookie**: La duración de la cookie (1 año) podría ser externalizada a una variable de entorno `TELEMETRY_SESSION_COOKIE_MAX_AGE_SECONDS` para una configuración más flexible.
 * 4. **Tipado Estricto de `logPayload`**: El tipo de `logPayload` podría ser importado desde los schemas de Zod (`VisitorLogSchema`) para garantizar la consistencia entre el payload que se construye aquí y el que se valida en la Server Action.
 * =====================================================================
 */
// src/middleware/handlers/telemetry/index.ts
