// src/middleware/handlers/maintenance/index.ts
/**
 * @file src/middleware/handlers/maintenance/index.ts
 * @description Manejador de middleware para el modo de mantenimiento. Alineado
 *              con la infraestructura de logging canónica de la aplicación.
 * @author L.I.A. Legacy
 * @copilot RaZ WriTe
 * @version 2.0.0
 */
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logger";

/**
 * @private
 * @function isIpWhitelisted
 * @description Verifica si una IP dada está presente en la lista blanca.
 * @param {string | undefined} requestIp - La IP del solicitante.
 * @returns {boolean} `true` si la IP está en la lista blanca.
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
 * @description Si el modo de mantenimiento está activado, reescribe la petición
 *              a la página estática `/maintenance.html`, a menos que la IP del
 *              solicitante esté en la lista blanca.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @returns {NextResponse | null} Una respuesta de reescritura o `null`.
 */
export function handleMaintenance(request: NextRequest): NextResponse | null {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";
  if (!isMaintenanceMode) {
    logger.trace(
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
    "[MAINTENANCE_HANDLER] DECISION: Acceso permitido. Pasando al siguiente manejador."
  );
  return null;
}
// src/middleware/handlers/maintenance/index.ts
