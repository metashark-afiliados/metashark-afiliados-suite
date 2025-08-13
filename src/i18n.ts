// src/i18n.ts
/**
 * @file src/i18n.ts
 * @description Orquestador de Internacionalización de Élite (Arquitectura IMAS Híbrida).
 *              Ha sido nivelado a un estándar de élite con tipado explícito,
 *              eliminando todos los `any` implícitos y resolviendo los errores
 *              de compilación.
 * @author Raz Podestá
 * @version 5.1.0
 */
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

import { logger } from "@/lib/logging";
import { type AppLocale, locales } from "@/lib/navigation";
import { messagesManifest } from "@/messages/manifest";
import { type MessageModule } from "@/messages/types";

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
      (
        acc: Record<string, any>,
        module: { default: MessageModule },
        index: number
      ) => {
        const namespace = namespaces[index];
        const defaultExport = module.default;

        if (defaultExport && defaultExport[typedLocale]) {
          acc[namespace] = defaultExport[typedLocale];
        } else {
          const fallbackLocale = Object.keys(defaultExport)[0] as AppLocale;
          if (fallbackLocale) {
            acc[namespace] = defaultExport[fallbackLocale];
            logger.warn(
              `[I18N Assembler] Locale '${typedLocale}' no encontrado para '${namespace}'. Usando fallback a '${fallbackLocale}'.`
            );
          }
        }
        return acc;
      },
      {}
    );

    return { messages };
  } catch (error) {
    logger.error("[I18N Orquestador] Fallo crítico al ensamblar mensajes", {
      locale: typedLocale,
      error,
    });
    return { messages: {} };
  }
});
// src/i18n.ts
