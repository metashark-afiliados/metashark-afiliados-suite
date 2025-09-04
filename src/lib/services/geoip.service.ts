// src/lib/services/geoip.service.ts
/**
 * @file src/lib/services/geoip.service.ts
 * @description Servicio de geolocalización de direcciones IP del lado del servidor.
 *              Refactorizado para alinearse con la firma de logging canónica de la
 *              Constitución y la SSoT de observabilidad.
 * @author L.I.A Legacy
 * @version 2.0.0
 */
"use server";
import "server-only";

import { logger } from "@/lib/logger";
import { isPrivateIpAddress } from "@/lib/utils";

const GEOIP_API_URL = process.env.GEOIP_API_URL || "http://ip-api.com/json/";

/**
 * @public
 * @async
 * @function lookupIpAddress
 * @description Realiza una búsqueda de geolocalización para una dirección IP dada.
 *              Filtra IPs privadas para evitar llamadas innecesarias y tiene un
 *              timeout para prevenir bloqueos prolongados.
 * @param {string | null} ipAddress - La dirección IP a buscar.
 * @returns {Promise<any | null>} Una promesa que resuelve con los datos GeoIP
 *          enriquecidos de la API, o `null` si la IP es inválida, privada,
 *          o si la llamada a la API falla o excede el tiempo de espera.
 */
export async function lookupIpAddress(
  ipAddress: string | null
): Promise<any | null> {
  if (!ipAddress || isPrivateIpAddress(ipAddress)) {
    logger.trace(
      { ipAddress },
      "[GeoIPService] No se realizará lookup GeoIP para IP inválida/privada."
    );
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // Timeout de 2 segundos.

    const response = await fetch(`${GEOIP_API_URL}${ipAddress}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      logger.error(
        {
          status: response.status,
          statusText: response.statusText,
          ipAddress,
        },
        `[GeoIPService] API externa GeoIP falló.`
      );
      return null;
    }

    const data = await response.json();

    if (data.status === "fail") {
      logger.warn(
        { reason: data.message, ipAddress },
        `[GeoIPService] API externa GeoIP devolvió un fallo.`
      );
      return null;
    }

    logger.trace({ ipAddress }, `[GeoIPService] Lookup exitoso.`);
    return data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      logger.warn(
        { ipAddress },
        `[GeoIPService] Lookup GeoIP abortado por timeout.`
      );
    } else {
      logger.error(
        { err: error, ipAddress },
        `[GeoIPService] Error de red en lookup GeoIP.`
      );
    }
    return null;
  }
}
// src/lib/services/geoip.service.ts
