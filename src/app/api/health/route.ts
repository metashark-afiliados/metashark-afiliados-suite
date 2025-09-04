// src/app/api/health/route.ts
/**
 * @file src/app/api/health/route.ts
 * @description Route Handler de élite para el Health Check. Actúa como un
 *              controlador delgado, delegando la lógica de negocio a la
 *              `healthCheckAction` y propagando el `correlationId`.
 * @author L.I.A. Legacy
 * @version 2.0.0
 * @see .docs-espejo/app/api/health/route.ts.md
 */
import { NextResponse, type NextRequest } from "next/server";
import { withCorrelationId } from "@/lib/helpers/correlation-id.helper";
import { healthCheckAction } from "@/lib/actions/health.actions";
import { isActionError } from "@/lib/validators";

export const dynamic = "force-dynamic";

/**
 * @private
 * @async
 * @function _get
 * @description Lógica interna del GET, envuelta para la inyección del correlationId.
 * @returns {Promise<NextResponse>} Una respuesta JSON con el estado del sistema.
 */
async function _get(): Promise<NextResponse> {
  const result = await healthCheckAction();

  if (isActionError(result)) {
    return NextResponse.json(
      { status: "error", error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json(result.data, { status: 200 });
}

/**
 * @public
 * @async
 * @function GET
 * @description Maneja las peticiones GET. Envuelve la lógica en `withCorrelationId`.
 * @param {NextRequest} request - La petición entrante.
 * @returns {Promise<NextResponse>} La respuesta final.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const correlationId = request.headers.get("x-request-id") || undefined;
  return withCorrelationId(() => _get(), correlationId);
}
// src/app/api/health/route.ts
