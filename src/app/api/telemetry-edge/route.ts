// src/app/api/telemetry-edge/route.ts
/**
 * @file route.ts
 * @description Endpoint de API seguro y de alto rendimiento para el enriquecimiento
 *              de telemetría. Diseñado para el Edge Runtime, alineado con Errores
 *              Soberanos, y enriquecido con `correlationId` para una observabilidad completa.
 * @author RaZ Podestá - MetaShark Tech
 * @version 5.0.0
 * @see .docs-espejo/app/api/telemetry-edge/route.ts.md
 */
import { NextResponse, type NextRequest } from "next/server";

import { enrichVisitorLogAction } from "@/lib/actions/telemetry.actions";
import { withCorrelationId } from "@/lib/helpers/correlation-id.helper";
import { logger } from "@/lib/logger";
import { isActionError } from "@/lib/validators";

export const runtime = "edge";

/**
 * @private
 * @async
 * @function _post
 * @description Lógica interna del POST, envuelta para la inyección del correlationId.
 * @param {NextRequest} request - La petición entrante.
 * @returns {Promise<NextResponse>} Una respuesta JSON.
 */
async function _post(request: NextRequest): Promise<NextResponse> {
  const authToken = request.headers.get("Authorization")?.split("Bearer ")[1];
  const context = {
    ip: request.ip,
    path: request.nextUrl.pathname,
  };

  if (authToken !== process.env.TELEMETRY_API_SECRET) {
    logger.warn(context, "[TelemetryEdge] Intento de acceso no autorizado.");
    return NextResponse.json(
      { success: false, error: "generic.error_permission_denied" },
      { status: 401 }
    );
  }

  try {
    const payload = await request.json();
    logger.trace(
      { ...context, sessionId: payload?.sessionId },
      "[TelemetryEdge] Petición autorizada."
    );

    const result = await enrichVisitorLogAction(payload);

    if (isActionError(result)) {
      const statusCode =
        result.error === "generic.error_invalid_data" ? 400 : 500;
      logger.warn(
        { ...context, result },
        "[TelemetryEdge] La Server Action devolvió un error."
      );
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
    logger.error(
      { err: error, ...context },
      "[TelemetryEdge] Error crítico al procesar la petición."
    );
    return NextResponse.json(
      { success: false, error: "generic.error_server_generic" },
      { status: 500 }
    );
  }
}

/**
 * @public
 * @async
 * @function POST
 * @description Maneja las peticiones POST. Envuelve la lógica en `withCorrelationId`.
 * @param {NextRequest} request - La petición entrante.
 * @returns {Promise<NextResponse>} La respuesta final.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const correlationId = request.headers.get("x-request-id") || undefined;
  return withCorrelationId(() => _post(request), correlationId);
}
// src/app/api/telemetry-edge/route.ts
