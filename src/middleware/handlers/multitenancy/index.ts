// src/middleware/handlers/multitenancy/index.ts
/**
 * @file src/middleware/handlers/multitenancy/index.ts
 * @description Manejador multi-tenant de élite. Valida la existencia de un
 *              subdominio contra un caché en el Edge (Vercel KV) antes de
 *              reescribir la URL, optimizando drásticamente el rendimiento.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type NextRequest, NextResponse } from "next/server";

import { getSiteSubdomainStatus } from "@/lib/data/sites-edge";
import { logger } from "@/lib/logging";
import { rootDomain } from "@/lib/utils";

export async function handleMultitenancy(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const { host, pathname } = request.nextUrl;
  const rootDomainWithoutPort = rootDomain.split(":")[0];
  const hostWithoutPort = host.split(":")[0];

  const isSubdomainRequest =
    hostWithoutPort !== rootDomainWithoutPort &&
    hostWithoutPort.endsWith(`.${rootDomainWithoutPort}`);

  if (isSubdomainRequest) {
    const subdomain = hostWithoutPort.replace(`.${rootDomainWithoutPort}`, "");
    logger.trace(`[MULTITENANCY_HANDLER] Subdominio detectado: ${subdomain}`);

    const isValidSubdomain = await getSiteSubdomainStatus(subdomain);

    if (!isValidSubdomain) {
      logger.warn(
        `[MULTITENANCY_HANDLER] Subdominio inválido o no encontrado en el caché del Edge: '${subdomain}'. Dejando que Next.js maneje el 404.`
      );
      return response;
    }

    const locale = response.headers.get("x-app-locale") || "pt-BR";
    const rewriteUrl = new URL(
      `/${locale}/s/${subdomain}${pathname}`,
      request.url
    );

    logger.info(
      "[MULTITENANCY_HANDLER] DECISION: Reescribiendo a ruta de sitio público.",
      { to: rewriteUrl.pathname }
    );

    const headers = new Headers(response.headers);
    return NextResponse.rewrite(rewriteUrl, { headers });
  }

  logger.trace(
    "[MULTITENANCY_HANDLER] DECISION: No es un subdominio. Pasando al siguiente manejador."
  );
  return response;
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Validación Preventiva en el Edge:** El manejador ahora valida la existencia del subdominio antes de la reescritura, optimizando el rendimiento.
 * 2. ((Implementada)) **Reducción de Carga del Backend:** Se reduce la carga sobre el runtime de Node.js y la base de datos PostgreSQL.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Soporte para Dominios Personalizados:** La lógica debe ser expandida para consultar también un set de `custom_domains` en Vercel KV.
 *
 * =====================================================================
 */
// src/middleware/handlers/multitenancy/index.ts
