// src/app/api/telemetry-edge/route.ts
/**
 * @file route.ts
 * @description Endpoint de API de ingesta de telemetría. Actúa como un
 *              "adaptador" delgado que invoca la Server Action `logVisitorAction`
 *              y traduce su resultado en una respuesta HTTP.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { NextResponse } from "next/server";

import { telemetry } from "@/lib/actions";
import { logger } from "@/lib/logging";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    logger.trace("[API:Telemetry] Invocando logVisitorAction...");

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
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) El endpoint ahora solo se ocupa de la capa HTTP. Toda la lógica de negocio ha sido abstraída a una Server Action, haciendo ambos aparatos más simples, cohesivos y reutilizables.
 *
 * @subsection Melhorias Futuras
 * 1. **Autenticación de Endpoint**: ((Vigente)) Para una seguridad de élite, el endpoint podría requerir un token de "bearer" secreto que solo el middleware conozca, para prevenir el abuso por parte de terceros.
 *
 * =====================================================================
 */
// src/app/api/telemetry-edge/route.ts
