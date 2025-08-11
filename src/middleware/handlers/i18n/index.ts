// src/middleware/handlers/i18n/index.ts
/**
 * @file i18n.ts
 * @description Manejador de i18n canónico. Delega la detección y redirección
 *              a `next-intl`.
 * @author L.I.A Legacy
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

export function handleI18n(request: NextRequest): NextResponse {
  logger.trace("[I18N_HANDLER] Delegando a next-intl middleware.");

  const pathname = request.nextUrl.pathname;
  const pathLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const handle = createIntlMiddleware({
    locales,
    localePrefix,
    pathnames,
    defaultLocale: DEFAULT_LOCALE,
    localeDetection: !pathLocale,
  });

  const response = handle(request);

  const detectedLocale =
    response.headers.get("x-next-intl-locale") || DEFAULT_LOCALE;
  response.headers.set("x-app-locale", detectedLocale);
  logger.info("[I18N_HANDLER] `next-intl` procesado.", {
    detectedLocale,
  });

  return response;
}
