// src/middleware/handlers/redirects/index.ts
/**
 * @file src/middleware/handlers/redirects/index.ts
 * @description Manejador de middleware para redirecciones canónicas (SEO).
 *              Alineado con la firma de logging de élite de Pino.
 * @author Raz Podesta - MetaShark Tech
 * @version 3.0.0
 * Florianópolis/SC, Brazil
 */
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logger";

/**
 * @public
 * @function handleRedirects
 * @description Inspecciona el host y redirige de `www.` al dominio canónico.
 * @param {NextRequest} request - La petición entrante.
 * @returns {NextResponse | null} Una respuesta de redirección 301 o null.
 */
export function handleRedirects(request: NextRequest): NextResponse | null {
  const { host, pathname, search } = request.nextUrl;

  if (host.startsWith("www.")) {
    const newHost = host.replace("www.", "");
    const newUrl = new URL(`${pathname}${search}`, `https://${newHost}`);

    logger.info(
      { from: host, to: newHost },
      "[REDIRECTS_HANDLER] DECISION: Redirigiendo `www.` a host canónico."
    );
    return NextResponse.redirect(newUrl, 301);
  }

  logger.trace(
    {},
    "[REDIRECTS_HANDLER] DECISION: No se necesita redirección. Pasando al siguiente manejador."
  );
  return null;
}
// src/middleware/handlers/redirects/index.ts