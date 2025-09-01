// src/lib/utils/ip.ts
/**
 * @file src/lib/utils/ip.ts
 * @description Aparato de utilidad atómico para la manipulación de IP.
 * @author L.I.A. Legacy
 * @co-piloto RaZ WriTe
 * @version 1.0.0
 * @see .docs-espejo/lib/utils/ip.md
 */
import { logger } from "@/lib/logging";

/**
 * @public
 * @function isPrivateIpAddress
 * @description Verifica si una dirección IP dada es una dirección IP privada (LAN).
 * @param {string} ip - La dirección IP a verificar.
 * @returns {boolean} `true` si la IP es privada, `false` en caso contrario.
 */
export function isPrivateIpAddress(ip: string): boolean {
  logger.trace({ ip }, "[isPrivateIpAddress] Verificando IP.");
  const privateIpRegex =
    /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3})|(172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})|(192\.168\.\d{1,3}\.\d{1,3})|(127\.0\.0\.1)$/;
  const isPrivate = privateIpRegex.test(ip);
  logger.trace(
    { ip, isPrivate },
    "[isPrivateIpAddress] Verificación completada."
  );
  return isPrivate;
}
// src/lib/utils/ip.ts
