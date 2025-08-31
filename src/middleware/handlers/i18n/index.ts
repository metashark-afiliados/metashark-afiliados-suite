// src/middleware/handlers/i18n/index.ts
/**
 * @file src/middleware/handlers/i18n/index.ts
 * @description Manejador de internacionalización (i18n) de élite. Implementa
 *              una detección de locale enriquecida y está alineado con la
 *              infraestructura de logging canónica de la aplicación.
 * @author L.I.A. Legacy
 * @copilot RaZ WriTe
 * @version 3.0.0
 */
import { type NextRequest, type NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { countryToLocaleMap } from "@/config/geoip-map";
import { logger } from "@/lib/logger";
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
      { forcedLocale },
      `[I18N_HANDLER] MODO OVERRIDE ACTIVO. Forzando locale vía cookie DEBUG_LOCALE.`
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
      const ip = request.ip ?? null;
      const geoData = await lookupIpAddress(ip);
      const countryCode = geoData?.countryCode;

      if (countryCode && countryToLocaleMap[countryCode]) {
        defaultLocaleForRequest = countryToLocaleMap[countryCode];
        logger.info(
          { ip, countryCode, detectedLocale: defaultLocaleForRequest },
          `[I18N_HANDLER] Locale detectado por GeoIP.`
        );
      }
    } catch (error) {
      logger.warn(
        { error: error instanceof Error ? error.message : String(error) },
        "[I18N_HANDLER] Fallo en la detección por GeoIP. Usando fallback global."
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

  logger.info(
    { detectedLocale },
    "[I18N_HANDLER] Procesamiento de next-intl completado."
  );

  return response;
}
// src/middleware/handlers/i18n/index.ts
