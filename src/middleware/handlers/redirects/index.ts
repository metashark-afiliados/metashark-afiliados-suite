// src/middleware/handlers/redirects/index.ts
/**
 * @file src/middleware/handlers/redirects/index.ts
 * @description Manejador de middleware para redirecciones canónicas (SEO).
 *              Su única responsabilidad es asegurar que los usuarios y los motores
 *              de búsqueda accedan al dominio sin el prefijo 'www.'.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { type NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logging";

export function handleRedirects(request: NextRequest): NextResponse | null {
  const { host } = request.nextUrl;
  if (host.startsWith("www.")) {
    const newHost = host.replace("www.", "");
    const newUrl = new URL(request.nextUrl.toString().replace(host, newHost));
    logger.info("[REDIRECTS_HANDLER] Redirigiendo 'www.' a host canónico.", {
      from: host,
      to: newHost,
    });
    return NextResponse.redirect(newUrl, 301);
  }
  return null;
}
