// src/lib/data/sites-edge.ts
/**
 * @file src/lib/data/sites-edge.ts
 * @description Aparato de datos atómico optimizado para el Edge Runtime. Su
 *              única responsabilidad es interactuar con Vercel KV para validar
 *              la existencia de subdominios con latencia ultrabaja.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-26
 * @see .docs-espejo/lib/data/sites-edge.ts.md
 */
"use server";
import "server-only";

import { kv } from "@vercel/kv";

import { logger } from "@/lib/logger";

/**
 * @public
 * @async
 * @function getSiteSubdomainStatus
 * @description Verifica la existencia de un subdominio consultando un set
 *              cacheado en Vercel KV.
 * @param {string} subdomain - El subdominio a verificar.
 * @returns {Promise<boolean>} `true` si el subdominio existe, `false` en caso contrario.
 */
export async function getSiteSubdomainStatus(
  subdomain: string
): Promise<boolean> {
  const context = { subdomain };
  try {
    const exists = await kv.sismember("subdomains", subdomain);
    const isAvailable = exists === 1;

    logger.trace(
      { ...context, isAvailable },
      "[SitesEdgeData] Verificación de subdominio en Vercel KV."
    );

    return isAvailable;
  } catch (error) {
    logger.error(
      { err: error, ...context },
      "[SitesEdgeData] Fallo crítico al consultar Vercel KV. Asumiendo que no existe."
    );
    // Fail-safe: si KV falla, devolvemos false (no existe) para evitar falsos positivos.
    return false;
  }
}
// src/lib/data/sites-edge.ts
