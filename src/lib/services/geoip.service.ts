// src/lib/services/geoip.service.ts
/**
 * @file src/lib/services/geoip.service.ts
 * @description Servicio de geolocalización de direcciones IP del lado del servidor.
 *              Utiliza una API externa (`ip-api.com`) como implementación principal y
 *              deja "sembrada" la lógica para una futura integración con una base de
 *              datos local de MaxMind GeoLite2 para un rendimiento de élite.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { logger } from "@/lib/logging";
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
      "[GeoIPService] No se realizará lookup GeoIP para IP inválida/privada.",
      { ipAddress }
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
        `[GeoIPService] API externa GeoIP falló para ${ipAddress}:`,
        { status: response.status, statusText: response.statusText }
      );
      return null;
    }

    const data = await response.json();

    if (data.status === "fail") {
      logger.warn(`[GeoIPService] API externa GeoIP falló para ${ipAddress}:`, {
        reason: data.message,
      });
      return null;
    }

    logger.trace(`[GeoIPService] Lookup exitoso para IP ${ipAddress}.`);
    return data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      logger.warn(
        `[GeoIPService] Lookup GeoIP para ${ipAddress} abortado por timeout.`
      );
    } else {
      logger.error(
        `[GeoIPService] Error de red en lookup GeoIP para ${ipAddress}:`,
        {
          message: error.message,
        }
      );
    }
    return null;
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Implementación de MaxMind GeoLite2**: ((Vigente)) Activar la lógica para usar una base de datos MaxMind local (`.mmdb`) descargada a `/tmp`. Esto eliminaría la dependencia de APIs externas, mejoraría la latencia y la fiabilidad. Requeriría configurar Supabase Storage para alojar el archivo de la base de datos y un proceso para su actualización periódica.
 * 2. **Caché en Memoria (LRU)**: ((Vigente)) Para mitigar el límite de peticiones de APIs gratuitas, se podría implementar un caché LRU (Least Recently Used) en memoria para las IPs más consultadas, reduciendo la latencia en invocaciones "cálidas".
 * 3. **Estrategia de Fallback**: ((Vigente)) Se podría configurar una segunda API de GeoIP gratuita y, si la primaria falla, intentar la consulta con la secundaria antes de devolver `null`.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Servicio de Enriquecimiento de Datos**: ((Implementada)) Se ha reconstruido el servicio de GeoIP, una pieza clave para la detección de idioma y la telemetría de visitantes.
 * 2. **Manejo de Errores Robusto**: ((Implementada)) La función incluye un `AbortController` para gestionar timeouts y maneja de forma segura los errores de red y las respuestas fallidas de la API.
 * 3. **Optimización de Peticiones**: ((Implementada)) Al utilizar el helper `isPrivateIpAddress`, el servicio evita realizar llamadas a la API para direcciones IP no públicas, ahorrando recursos.
 *
 * =====================================================================
 */
// src/lib/services/geoip.service.ts
