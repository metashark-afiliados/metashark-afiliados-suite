// src/middleware/handlers/multitenancy/index.ts
/**
 * @file src/middleware/handlers/multitenancy/index.ts
 * @description Manejador multi-tenant de élite. Valida la existencia de un
 *              subdominio contra un caché en el Edge (Vercel KV) antes de
 *              reescribir la URL, y está alineado con la infraestructura de
 *              logging canónica de la aplicación.
 * @author Raz Podesta - MetaShark Tech
 * @version 4.0.0
 * Florianópolis/SC, Brazil
 */
import { type NextRequest, NextResponse } from "next/server";

import { rootDomain } from "@/config/site.config";
import { getSiteSubdomainStatus } from "@/lib/data/sites-edge";
import { logger } from "@/lib/logger";

/**
 * @public
 * @async
 * @function handleMultitenancy
 * @description Maneja el enrutamiento para subdominios y dominios personalizados.
 * @param {NextRequest} request - La petición entrante.
 * @param {NextResponse} response - La respuesta del manejador anterior.
 * @returns {Promise<NextResponse>} La respuesta final (potencialmente modificada).
 */
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
    logger.trace(
      { subdomain },
      "[MULTITENANCY_HANDLER] Subdominio detectado."
    );

    const isValidSubdomain = await getSiteSubdomainStatus(subdomain);

    if (!isValidSubdomain) {
      logger.warn(
        { subdomain },
        "[MULTITENANCY_HANDLER] Subdominio inválido o no encontrado en caché. Dejando que Next.js maneje el 404."
      );
      return response;
    }

    const locale = response.headers.get("x-app-locale") || "pt-BR";
    const rewriteUrl = new URL(
      `/${locale}/s/${subdomain}${pathname}`,
      request.url
    );

    logger.info(
      { to: rewriteUrl.pathname },
      "[MULTITENANCY_HANDLER] DECISION: Reescribiendo a ruta de sitio público."
    );

    const headers = new Headers(response.headers);
    return NextResponse.rewrite(rewriteUrl, { headers });
  }

  logger.trace(
    {},
    "[MULTITENANCY_HANDLER] DECISION: No es un subdominio. Pasando al siguiente manejador."
  );
  return response;
}
// src/middleware/handlers/multitenancy/index.ts