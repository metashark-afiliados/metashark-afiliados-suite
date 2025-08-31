// src/i18n.ts
/**
 * @file src/i18n.ts
 * @description Orquestador de Internacionalización de élite. Este aparato es
 *              el motor y guardián de la estrategia IMAS. Carga, ensambla y
 *              valida los mensajes contra el `i18nSchema` maestro, actuando
 *              como una barrera de calidad para el contenido de la aplicación.
 * @author L.I.A. Legacy
 * @copilot RaZ WriTe
 * @version 13.1.0
 * @see .docs-espejo/lib/i18n.ts.md
 */
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

import { setNestedProperty } from "@/lib/helpers/set-nested-property.helper";
import { logger } from "@/lib/logger";
import { type AppLocale, locales } from "@/lib/navigation";
import { i18nSchema } from "@/lib/validators";
import { messagesManifest } from "@/messages/manifest";

export const defaultLocale: AppLocale = "es-ES";

export default getRequestConfig(async ({ locale }) => {
  const typedLocale = locale as AppLocale;

  if (!locales.includes(typedLocale)) {
    notFound();
  }

  const namespaces = Object.keys(
    messagesManifest
  ) as (keyof typeof messagesManifest)[];

  try {
    const modulePromises = namespaces.map((ns) => messagesManifest[ns]());
    const modules = await Promise.all(modulePromises);

    const messages = modules.reduce(
      (acc, module, index) => {
        const namespace = namespaces[index];
        const localeMessages = module.default?.[typedLocale];

        if (localeMessages) {
          setNestedProperty(acc, namespace, localeMessages);
        } else {
          logger.warn(
            `[I18N] Faltan traducciones para el namespace '${namespace}' en el locale '${typedLocale}'.`
          );
        }
        return acc;
      },
      {} as Record<string, any>
    );

    const validation = i18nSchema.safeParse(messages);
    if (!validation.success) {
      const errorMessage = `[I18N] INCONSISTENCIA CRÍTICA: Los mensajes ensamblados para el locale '${typedLocale}' no cumplen con el contrato i18nSchema.`;
      logger.error({ errors: validation.error.flatten() }, errorMessage);
      throw new Error(errorMessage);
    }
    logger.trace(
      `[I18N] Mensajes para locale '${typedLocale}' validados con éxito.`
    );

    return { messages: validation.data as any };
  } catch (error) {
    // --- INICIO DE REFACTORIZACIÓN (Firma de Pino API) ---
    logger.error(
      {
        locale: typedLocale,
        error: error instanceof Error ? error.message : String(error),
      },
      "[I18N] Fallo crítico al ensamblar mensajes."
    );
    // --- FIN DE REFACTORIZACIÓN ---
    return { messages: {} };
  }
});
// src/i18n.ts
