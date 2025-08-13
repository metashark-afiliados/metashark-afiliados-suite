// src/middleware/handlers/maintenance/index.ts
/**
 * @file src/middleware/handlers/maintenance/index.ts
 * @description Manejador de middleware para el modo de mantenimiento. Permite poner
 *              el sitio fuera de línea para todos los visitantes, excepto para
 *              aquellos cuyas direcciones IP estén en una lista blanca definida en
 *              las variables de entorno.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logging";

/**
 * @private
 * @function isIpWhitelisted
 * @description Verifica si una IP dada está presente en la lista blanca de IPs
 *              configurada en la variable de entorno `MAINTENANCE_IP_WHITELIST`.
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
      `[MaintenanceHandler] Bypass de mantenimiento concedido para IP en lista blanca: ${requestIp}`
    );
    return true;
  }
  return false;
}

/**
 * @public
 * @function handleMaintenance
 * @description Si el modo de mantenimiento está activado (`MAINTENANCE_MODE=true`),
 *              reescribe la petición a la página estática `/maintenance.html`, a menos
 *              que la IP del solicitante esté en la lista blanca.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @returns {NextResponse | null} Una respuesta de reescritura si el sitio está en
 *          mantenimiento, o `null` para continuar el pipeline.
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
      "[MAINTENANCE_HANDLER] DECISION: Bloqueando petición. Modo mantenimiento activo.",
      { path: pathname, ip: ip }
    );
    return NextResponse.rewrite(new URL("/maintenance.html", request.url));
  }

  logger.trace(
    "[MAINTENANCE_HANDLER] DECISION: Acceso permitido. Pasando al siguiente manejador."
  );
  return null;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Soporte para Rangos de IP (CIDR)**: ((Vigente)) La función `isIpWhitelisted` podría ser mejorada para soportar rangos de IP en notación CIDR (ej. `192.168.1.0/24`), lo cual es más flexible para oficinas o redes de desarrollo.
 * 2. **Página de Mantenimiento Dinámica**: ((Vigente)) En lugar de una página HTML estática, se podría reescribir a una ruta de Next.js (`/maintenance`) que pueda obtener contenido dinámico (ej. un tiempo estimado de vuelta) desde un servicio externo o una variable de entorno.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Reconstrucción de Alta Fidelidad**: ((Implementada)) La lógica ha sido restaurada fielmente, incluyendo el bypass por IP, garantizando cero regresiones.
 * 2. **Principio de Responsabilidad Única (SRP)**: ((Implementada)) La lógica de verificación de IP se ha extraído a una función privada `isIpWhitelisted`, mejorando la claridad y la atomicidad del código.
 * 3. **Observabilidad Completa**: ((Implementada)) Se registran logs de `trace`, `info` y `warn` para cada decisión tomada por el manejador, proporcionando una visibilidad completa de su comportamiento.
 *
 * =====================================================================
 */
// src/middleware/handlers/maintenance/index.ts
