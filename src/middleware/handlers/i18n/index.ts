// src/middleware/handlers/i18n/index.ts
/**
 * @file src/middleware/handlers/i18n/index.ts
 * @description Manejador de internacionalización (i18n) canónico. Este aparato
 *              delega toda la lógica de detección de idioma, manejo de cookies y
 *              reescritura de rutas a la implementación optimizada de `next-intl`.
 *              Su responsabilidad principal es invocar el middleware de `next-intl`
 *              y propagar el `locale` detectado a través de una cabecera personalizada
 *              (`x-app-locale`) para que los manejadores posteriores en el pipeline
 *              puedan consumirlo.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { type NextRequest, type NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { logger } from "@/lib/logging";
import {
  type AppLocale,
  localePrefix,
  locales,
  pathnames,
} from "@/lib/navigation";

const DEFAULT_LOCALE: AppLocale = "pt-BR";

/**
 * @public
 * @function handleI18n
 * @description Ejecuta el middleware de `next-intl` y enriquece la respuesta
 *              con la cabecera `x-app-locale`.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @returns {NextResponse} La respuesta generada por `next-intl`, que puede ser
 *          una redirección, una reescritura o la respuesta original con cookies añadidas.
 */
export function handleI18n(request: NextRequest): NextResponse {
  logger.trace("[I18N_HANDLER] Delegando a next-intl middleware.");

  const handle = createIntlMiddleware({
    locales,
    localePrefix,
    pathnames,
    defaultLocale: DEFAULT_LOCALE,
  });

  const response = handle(request);

  // Propaga el locale detectado para que otros manejadores lo puedan usar.
  const detectedLocale =
    response.headers.get("x-next-intl-locale") || DEFAULT_LOCALE;
  response.headers.set("x-app-locale", detectedLocale);

  logger.info("[I18N_HANDLER] `next-intl` procesado.", {
    detectedLocale,
  });

  return response;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Dominios por Locale**: ((Vigente)) Investigar la configuración de `next-intl` para soportar dominios diferentes por idioma (ej. `metashark.es`, `metashark.com.br`) para una estrategia de SEO internacional avanzada.
 * 2. **Detección de Idioma Personalizada**: ((Vigente)) La librería `next-intl` permite pasar una función `localeDetection` personalizada. Se podría implementar una lógica más avanzada que considere la geolocalización por IP (usando el servicio ya reconstruido) como un factor adicional en la detección del idioma.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Restauración de Enrutamiento**: ((Implementada)) La reconstrucción de este manejador es el paso más crítico para resolver el error 404, ya que restaura la lógica que conecta las URLs entrantes con las rutas de página físicas.
 * 2. **Delegación a Estándar de Élite**: ((Implementada)) El manejador delega la compleja lógica de i18n a `next-intl`, que es la librería estándar de la industria para esta tarea, garantizando una implementación robusta y mantenible.
 * 3. **Observabilidad**: ((Implementada)) Se registran logs de `trace` e `info` para monitorear el proceso de detección de idioma.
 *
 * =====================================================================
 */
// src/middleware/handlers/i18n/index.ts
