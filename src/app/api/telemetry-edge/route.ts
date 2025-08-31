// src/app/api/telemetry-edge/route.ts
/**
 * @file route.ts
 * @description Endpoint de API seguro y de alto rendimiento para el enriquecimiento
 *              de telemetría del cliente. Diseñado para el Edge Runtime.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 4.0.0
 */
import { NextResponse, type NextRequest } from "next/server";

import { enrichVisitorLogAction } from "@/lib/actions/telemetry.actions";
import { logger } from "@/lib/logging";
import { isActionError } from "@/lib/validators";

// --- Configuración del Edge Runtime ---
export const runtime = "edge";

/**
 * @public
 * @function POST
 * @description Manejador para las peticiones POST. Recibe un payload de enriquecimiento
 *              del cliente, valida el token de autorización, e invoca la Server Action
 *              correspondiente para actualizar el log de visitante.
 * @param {NextRequest} request - La petición entrante.
 * @returns {Promise<NextResponse>} Una respuesta JSON indicando el resultado.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const authToken = request.headers.get("Authorization")?.split("Bearer ")[1];

  if (authToken !== process.env.TELEMETRY_API_SECRET) {
    logger.warn("[API:TelemetryEdge] Intento de acceso no autorizado bloqueado.", {
      ip: request.ip,
      path: request.nextUrl.pathname,
    });
    return NextResponse.json(
      { success: false, error: "generic.error_permission_denied" },
      { status: 401 }
    );
  }

  try {
    const payload = await request.json();
    logger.trace(
      "[API:TelemetryEdge] Petición autorizada. Invocando enrichVisitorLogAction.",
      { sessionId: payload?.sessionId }
    );

    const result = await enrichVisitorLogAction(payload);

    if (isActionError(result)) {
      const statusCode =
        result.error === "ValidationErrors.invalid_data" ? 400 : 500;
      return NextResponse.json(
        { success: false, error: result.error },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { success: true, message: "Log enriquecido con éxito." },
      { status: 200 }
    );
  } catch (error) {
    const errorId = `telemetry-edge-err-${Date.now()}`;
    logger.error(`[API:TelemetryEdge] Error crítico al procesar la petición. ID: ${errorId}`, {
      error: error instanceof Error ? error.message : String(error),
    });
    // No se usa createPersistentErrorLog porque puede depender de APIs de Node.js no disponibles en el Edge.
    return NextResponse.json(
      { success: false, error: "generic.error_server_generic", errorId },
      { status: 500 }
    );
  }
}
// src/app/api/telemetry-edge/route.ts