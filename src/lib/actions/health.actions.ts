// src/lib/actions/health.actions.ts
/**
 * @file health.actions.ts
 * @description Server Action atómica para verificar la salud del sistema.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { logger } from "@/lib/logger";
import { type ActionResult } from "@/lib/validators";

type HealthStatus = {
  status: "ok";
  timestamp: string;
  service: string;
};

/**
 * @public
 * @async
 * @function healthCheckAction
 * @description Realiza una verificación de salud simple del servicio.
 * @returns {Promise<ActionResult<HealthStatus>>} El estado de salud.
 */
export async function healthCheckAction(): Promise<ActionResult<HealthStatus>> {
  const healthData: HealthStatus = {
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "convertikit-api",
  };
  logger.trace(
    { healthData },
    "[healthCheckAction] Verificación de salud exitosa."
  );
  return { success: true, data: healthData };
}
// src/lib/actions/health.actions.ts
