// src/app/api/telemetry-edge/route.ts
/**
 * @file route.ts
 * @description Endpoint de API de ingesta de telemetría. Ha sido blindado para
 *              requerir un token de autenticación secreto, previniendo el abuso
 *              y garantizando la integridad de los datos.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { NextResponse, type NextRequest } from "next/server";

import { telemetry } from "@/lib/actions";
import { logger } from "@/lib/logging";

export async function POST(request: NextRequest) {
  // --- INICIO DE MEJORA DE SEGURIDAD ---
  const authToken = request.headers.get("Authorization")?.split("Bearer ")[1];

  if (authToken !== process.env.TELEMETRY_API_SECRET) {
    logger.warn("[API:Telemetry] Intento de acceso no autorizado bloqueado.", {
      ip: request.ip,
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // --- FIN DE MEJORA DE SEGURIDAD ---

  try {
    const payload = await request.json();
    logger.trace(
      "[API:Telemetry] Petición autorizada. Invocando logVisitorAction..."
    );

    const result = await telemetry.logVisitorAction(payload);

    if (!result.success) {
      const statusCode =
        result.error === "ValidationErrors.invalid_data" ? 400 : 500;
      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json({ message: "Log registrado." }, { status: 201 });
  } catch (error) {
    logger.error("[API:Telemetry] Error crítico al procesar la petición.", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "ValidationErrors.error_server_generic" },
      { status: 500 }
    );
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Blindaje de Endpoint Completado:** El endpoint ahora valida el token `Bearer`, completando la solución de seguridad y previniendo el abuso.
 *
 * =====================================================================
 */
// src/app/api/telemetry-edge/route.ts
