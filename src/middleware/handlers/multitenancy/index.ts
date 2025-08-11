// src/middleware/handlers/multitenancy/index.ts
/**
 * @file src/middleware/handlers/multitenancy/index.ts
 * @description Manejador para la lógica multi-tenant. Identifica peticiones a subdominios
 *              y las reescribe internamente a la ruta de renderizado correcta.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { type NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logging";
import { rootDomain } from "@/lib/utils";

export function handleMultitenancy(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  const { host, pathname } = request.nextUrl;
  const rootDomainWithoutPort = rootDomain.split(":")[0];
  const hostWithoutPort = host.split(":")[0];
  const subdomain = hostWithoutPort.endsWith(`.${rootDomainWithoutPort}`)
    ? hostWithoutPort.replace(`.${rootDomainWithoutPort}`, "")
    : null;

  if (subdomain) {
    logger.trace(`[MULTITENANCY_HANDLER] Subdominio detectado: ${subdomain}`);
    const locale = response.headers.get("x-app-locale") || "pt-BR";
    const rewriteUrl = new URL(
      `/${locale}/s/${subdomain}${pathname}`,
      request.url
    );
    return NextResponse.rewrite(rewriteUrl, { headers: response.headers });
  }
  return response;
}
