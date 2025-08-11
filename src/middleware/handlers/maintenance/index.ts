// src/middleware/handlers/maintenance/index.ts
/**
 * @file src/middleware/handlers/maintenance/index.ts
 * @description Manejador de middleware para el modo de mantenimiento.
 *              Permite poner el sitio fuera de línea para todos excepto para
 *              las IPs en la lista blanca.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { type NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logging";

export function handleMaintenance(request: NextRequest): NextResponse | null {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";
  if (!isMaintenanceMode) {
    return null;
  }
  const { pathname } = request.nextUrl;
  const ip = request.ip || "127.0.0.1";
  const whitelist = (process.env.MAINTENANCE_IP_WHITELIST || "").split(",");
  if (whitelist.includes(ip)) {
    logger.info(`[MAINTENANCE_HANDLER] Bypass para IP en lista blanca: ${ip}`);
    return null;
  }
  if (pathname.startsWith("/maintenance")) {
    return null;
  }
  logger.warn(
    `[MAINTENANCE_HANDLER] Bloqueando acceso a ${pathname} por modo mantenimiento.`
  );
  return NextResponse.rewrite(new URL("/maintenance.html", request.url));
}
