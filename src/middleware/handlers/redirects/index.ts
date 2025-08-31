// src/middleware/handlers/redirects/index.ts
/**
 * @file src/middleware/handlers/redirects/index.ts
 * @description Manejador de middleware para redirecciones canónicas (SEO).
 *              Alineado con la infraestructura de logging canónica de la aplicación.
 * @author L.I.A. Legacy
 * @copilot RaZ WriTe
 * @version 2.0.0
 */
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logger";

/**
 * @public
 * @function handleRedirects
 * @description Comprueba si el host de la petición comienza con 'www.' y, si es así,
 *              devuelve una respuesta de redirección permanente (301) al dominio
 *              canónico sin 'www.', preservando la ruta y los parámetros de búsqueda.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @returns {NextResponse | null} Una respuesta de redirección si es necesario, o null para continuar el pipeline.
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
    "[REDIRECTS_HANDLER] DECISION: No se necesita redirección. Pasando al siguiente manejador."
  );
  return null;
}
// src/middleware/handlers/redirects/index.ts
