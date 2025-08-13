// src/middleware/handlers/multitenancy/index.ts
/**
 * @file src/middleware/handlers/multitenancy/index.ts
 * @description Manejador para la lógica multi-tenant. Identifica peticiones a
 *              subdominios y las reescribe internamente a la ruta de renderizado
 *              canónica `/s/[subdomain]`, preservando el locale. Esta es una pieza
 *              central de la arquitectura SaaS del proyecto.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logging";
import { rootDomain } from "@/lib/utils";

/**
 * @public
 * @function handleMultitenancy
 * @description Detecta si el `host` de la petición corresponde a un subdominio de
 *              la aplicación. Si es así, reescribe la URL para que Next.js la
 *              enrute al `app/s/[subdomain]/page.tsx`, pasando el `locale` y el
 *              `pathname` original.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @param {NextResponse} response - La respuesta del manejador anterior (i18n),
 *                                  de la cual se extrae el `locale` detectado.
 * @returns {NextResponse} La respuesta, que puede ser una reescritura o la original.
 */
export function handleMultitenancy(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  const { host, pathname } = request.nextUrl;
  const rootDomainWithoutPort = rootDomain.split(":")[0];
  const hostWithoutPort = host.split(":")[0];

  const isSubdomainRequest =
    hostWithoutPort !== rootDomainWithoutPort &&
    hostWithoutPort.endsWith(`.${rootDomainWithoutPort}`);

  if (isSubdomainRequest) {
    const subdomain = hostWithoutPort.replace(`.${rootDomainWithoutPort}`, "");
    logger.trace(`[MULTITENANCY_HANDLER] Subdominio detectado: ${subdomain}`);

    const locale = response.headers.get("x-app-locale") || "pt-BR";
    const rewriteUrl = new URL(
      `/${locale}/s/${subdomain}${pathname}`,
      request.url
    );

    logger.info(
      "[MULTITENANCY_HANDLER] DECISION: Reescribiendo a ruta de sitio público.",
      { to: rewriteUrl.pathname }
    );

    // Se clonan las cabeceras de la respuesta anterior para preservar el locale.
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
 * @subsection Melhorias Futuras
 * 1. **Cacheo de Subdominios Válidos (Edge Caching)**: ((Vigente)) Para optimizar el rendimiento, se podría consultar si el subdominio existe en la base de datos (con caché en Vercel KV) aquí mismo. Si no existe, se podría redirigir a una página 404 personalizada en lugar de dejar que Next.js lo maneje, proporcionando una UX más rápida.
 * 2. **Soporte para Dominios Personalizados**: ((Vigente)) La lógica debería ser expandida para consultar una tabla `sites` por `custom_domain` además de por `subdomain`, permitiendo que los usuarios conecten sus propios dominios.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Reconstrucción de Lógica Multi-Tenant**: ((Implementada)) Este aparato restaura la funcionalidad central SaaS del proyecto, permitiendo que las peticiones a subdominios sean enrutadas correctamente.
 * 2. **Integración con Pipeline**: ((Implementada)) La función consume y propaga correctamente el objeto `NextResponse`, asegurando que la cabecera `x-app-locale` establecida por el manejador de i18n se conserve.
 *
 * =====================================================================
 */
// src/middleware/handlers/multitenancy/index.ts
