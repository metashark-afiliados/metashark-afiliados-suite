// src/middleware/handlers/redirects/index.ts
/**
 * @file src/middleware/handlers/redirects/index.ts
 * @description Manejador de middleware para redirecciones canónicas (SEO). Su única
 *              responsabilidad es asegurar que los usuarios y los motores de búsqueda
 *              accedan al dominio sin el prefijo 'www.', emitiendo una redirección
 *              permanente (301) para consolidar la autoridad del dominio.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logging";

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
      "[REDIRECTS_HANDLER] DECISION: Redirigiendo 'www.' a host canónico.",
      { from: host, to: newHost }
    );
    return NextResponse.redirect(newUrl, 301);
  }

  logger.trace(
    "[REDIRECTS_HANDLER] DECISION: No se necesita redirección. Pasando al siguiente manejador."
  );
  return null;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Redirecciones desde Base de Datos**: ((Vigente)) Para una flexibilidad de marketing de élite, se podría crear una tabla `redirects` en Supabase (`from_path`, `to_path`, `status_code`). Este manejador podría consultar esa tabla (con caché) para gestionar redirecciones de marketing sin necesidad de un redespliegue.
 * 2. **Normalización de Slashes**: ((Vigente)) Añadir lógica para asegurar que las URLs siempre tengan (o no tengan) un slash al final, según la política de SEO definida, para evitar contenido duplicado.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Reconstrucción de Alta Fidelidad**: ((Implementada)) Se ha restaurado la lógica original del manejador, garantizando cero regresiones funcionales y manteniendo la optimización SEO con el código de estado 301.
 * 2. **Observabilidad Completa**: ((Implementada)) La función ahora utiliza `logger.info` para decisiones de redirección y `logger.trace` para el paso sin acción, proporcionando una visibilidad completa de su comportamiento.
 * 3. **Desacoplamiento**: ((Implementada)) El manejador es una función pura y atómica que no depende de otros manejadores, adhiriéndose a la Filosofía LEGO.
 *
 * =====================================================================
 */
// src/middleware/handlers/redirects/index.ts
