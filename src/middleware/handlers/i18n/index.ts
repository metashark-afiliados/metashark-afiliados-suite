// src/middleware/handlers/i18n/index.ts
/**
 * @file src/middleware/handlers/i18n/index.ts
 * @description Manejador de internacionalización (i18n) de élite. Ha sido
 *              refactorizado para implementar una detección de locale
 *              enriquecida y optimizada, y corregido para una seguridad de
 *              tipos robusta.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.2.1
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type NextRequest, type NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { countryToLocaleMap } from "@/config/geoip-map";
import { logger } from "@/lib/logging";
import {
  type AppLocale,
  localePrefix,
  locales,
  pathnames,
} from "@/lib/navigation";
import { lookupIpAddress } from "@/lib/services/geoip.service";

const GLOBAL_DEFAULT_LOCALE: AppLocale = "es-ES";

export async function handleI18n(request: NextRequest): Promise<NextResponse> {
  logger.trace("[I18N_HANDLER] Iniciando detección de locale.");

  const debugLocaleCookie = request.cookies.get("DEBUG_LOCALE");
  if (
    debugLocaleCookie &&
    locales.includes(debugLocaleCookie.value as AppLocale)
  ) {
    const forcedLocale = debugLocaleCookie.value as AppLocale;
    logger.warn(
      `[I18N_HANDLER] MODO OVERRIDE ACTIVO. Forzando locale a '${forcedLocale}' vía cookie DEBUG_LOCALE.`
    );

    const handle = createIntlMiddleware({
      locales,
      localePrefix,
      pathnames,
      defaultLocale: forcedLocale,
    });
    const response = handle(request);
    response.headers.set("x-app-locale", forcedLocale);
    return response;
  }

  let defaultLocaleForRequest = GLOBAL_DEFAULT_LOCALE;
  if (!request.cookies.has("NEXT_LOCALE")) {
    try {
      // --- INICIO DE CORRECCIÓN DE TIPO ---
      const ip = request.ip ?? null;
      // --- FIN DE CORRECCIÓN DE TIPO ---
      const geoData = await lookupIpAddress(ip);
      const countryCode = geoData?.countryCode;

      if (countryCode && countryToLocaleMap[countryCode]) {
        defaultLocaleForRequest = countryToLocaleMap[countryCode];
        logger.info(
          `[I18N_HANDLER] Locale detectado por GeoIP: ${defaultLocaleForRequest}`,
          { ip, countryCode }
        );
      }
    } catch (error) {
      logger.warn(
        "[I18N_HANDLER] Fallo en la detección por GeoIP. Usando fallback global.",
        error
      );
    }
  }

  const handle = createIntlMiddleware({
    locales,
    localePrefix,
    pathnames,
    defaultLocale: defaultLocaleForRequest,
  });

  const response = handle(request);
  const detectedLocale =
    response.headers.get("x-next-intl-locale") || defaultLocaleForRequest;
  response.headers.set("x-app-locale", detectedLocale);

  logger.info("[I18N_HANDLER] Procesamiento de next-intl completado.", {
    detectedLocale,
  });

  return response;
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Seguridad de Tipos Robusta:** Se ha utilizado el operador "Nullish Coalescing" (`?? null`) para convertir el `string | undefined` de `request.ip` al `string | null` esperado por `lookupIpAddress`, resolviendo el error de tipo `TS2345` de forma segura.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **UI para Gestión de Cookies de Debug:** En el futuro `Dev Console`, se podría añadir una sección que permita a los desarrolladores establecer o eliminar cookies de depuración (como `DEBUG_LOCALE`) a través de una interfaz gráfica.
 *
 * =====================================================================
 */
// src/middleware/handlers/i18n/index.ts
