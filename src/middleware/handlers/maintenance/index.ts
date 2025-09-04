// src/middleware/handlers/maintenance/index.ts
/**
 * @file src/middleware/handlers/maintenance/index.ts
 * @description Manejador de middleware para el modo de mantenimiento. Alineado
 *              con la firma de logging de élite de Pino y corregido para un
 *              manejo de flujo de control robusto.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 3.0.0
 */
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logger";

/**
 * @private
 * @function isIpWhitelisted
 * @description Verifica si una IP está en la lista blanca de mantenimiento.
 * @param {string | undefined} requestIp - La IP de la petición.
 * @returns {boolean} True si la IP está en la lista blanca.
 */
function isIpWhitelisted(requestIp: string | undefined): boolean {
  if (!requestIp) return false;

  const whitelist = (process.env.MAINTENANCE_IP_WHITELIST || "")
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);

  if (whitelist.length > 0 && whitelist.includes(requestIp)) {
    logger.info(
      { ip: requestIp },
      "[MaintenanceHandler] Bypass de mantenimiento concedido para IP en lista blanca."
    );
    return true;
  }
  return false;
}

/**
 * @public
 * @function handleMaintenance
 * @description El manejador principal del modo de mantenimiento.
 * @param {NextRequest} request - La petición entrante.
 * @returns {NextResponse | null} Una respuesta de reescritura si el sitio está en
 *          mantenimiento, o null para continuar con el pipeline.
 */
export function handleMaintenance(request: NextRequest): NextResponse | null {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";
  if (!isMaintenanceMode) {
    logger.trace(
      {},
      "[MAINTENANCE_HANDLER] DECISION: Modo inactivo. Pasando al siguiente manejador."
    );
    return null;
  }

  const { pathname } = request.nextUrl;
  const ip = request.ip;
  const isBypassed = isIpWhitelisted(ip);
  const isMaintenancePage = pathname === "/maintenance.html";

  if (!isBypassed && !isMaintenancePage) {
    logger.warn(
      { path: pathname, ip: ip },
      "[MAINTENANCE_HANDLER] DECISION: Bloqueando petición. Modo mantenimiento activo."
    );
    return NextResponse.rewrite(new URL("/maintenance.html", request.url));
  }

  logger.trace(
    { path: pathname, ip, isBypassed, isMaintenancePage },
    "[MAINTENANCE_HANDLER] DECISION: Petición permitida. Pasando al siguiente manejador."
  );
  return null;
}
// src/middleware/handlers/maintenance/index.ts