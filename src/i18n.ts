// src/i18n.ts
/**
 * @file src/i18n.ts
 * @description Orquestador de Internacionalización de élite. Configura `next-intl`
 *              para la carga dinámica y perezosa (lazy-loading) de namespaces,
 *              optimizando el rendimiento del servidor y adhiriéndose a la
 *              arquitectura canónica.
 * @author L.I.A. Legacy
 * @version 14.0.0
 * @see .docs-espejo/lib/i18n.ts.md
 */
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

import { logger } from "@/lib/logger";
import { type AppLocale, locales } from "@/lib/navigation";

export const defaultLocale: AppLocale = "es-ES";

export default getRequestConfig(async ({ locale }) => {
  const typedLocale = locale as AppLocale;

  // 1. Validar que el locale solicitado sea uno de los soportados.
  if (!locales.includes(typedLocale)) {
    logger.warn(
      { locale },
      "[I18N] Se solicitó un locale no válido. Devolviendo 404."
    );
    notFound();
  }

  // 2. Devolver la configuración de carga dinámica de mensajes.
  // next-intl cargará automáticamente el archivo JSON correspondiente
  // al namespace solicitado por `getTranslations` o `useTranslations`.
  // La validación de la estructura de estos JSONs se delega a los
  // schemas de Zod en el pipeline de CI/CD.
  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
// src/i18n.ts
