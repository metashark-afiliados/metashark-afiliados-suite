// src/lib/data/sites-edge.ts
/**
 * @file src/lib/data/sites-edge.ts
 * @description Aparato de datos atómico optimizado para el Edge Runtime. Su
 *              única responsabilidad es interactuar con Vercel KV para validar
 *              la existencia de subdominios con latencia ultrabaja.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import "server-only";

import { kv } from "@vercel/kv";
import { logger } from "@/lib/logging";

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
  try {
    const exists = await kv.sismember("subdomains", subdomain);
    logger.trace(
      `[SitesEdgeData] Verificación de subdominio en Vercel KV para '${subdomain}': ${
        exists ? "ENCONTRADO" : "NO ENCONTRADO"
      }`
    );
    return exists === 1;
  } catch (error) {
    logger.error(
      `[SitesEdgeData] Fallo crítico al consultar Vercel KV para el subdominio '${subdomain}'. Se asumirá que no existe por seguridad.`,
      error
    );
    return false;
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Capa de Datos para el Edge:** Este aparato crea una capa de acceso a datos especializada y de alto rendimiento.
 * 2. ((Implementada)) **Resiliencia y Seguridad:** En caso de un fallo de conexión con Vercel KV, la función devuelve `false` por defecto.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Sincronización Automática:** Crear una Server Action que, tras la creación/eliminación de un sitio, actualice el set `subdomains` en Vercel KV.
 *
 * =====================================================================
 */
// src/lib/data/sites-edge.ts
