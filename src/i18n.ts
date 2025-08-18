// src/i18n.ts
/**
 * @file src/i18n.ts
 * @description Orquestador de Internacionalización. Ha sido refactorizado
 *              para eliminar la dependencia de `lodash`, haciéndolo compatible
 *              con el Edge Runtime y resolviendo el error de build.
 * @author Raz Podestá
 * @version 8.1.0
 */
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

import { setNestedProperty } from "@/lib/helpers/set-nested-property.helper";
import { logger } from "@/lib/logging";
import { type AppLocale, locales } from "@/lib/navigation";
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

    return { messages };
  } catch (error) {
    logger.error("[I18N] Fallo crítico al ensamblar mensajes.", {
      locale: typedLocale,
      error: error instanceof Error ? error.message : String(error),
    });
    return { messages: {} };
  }
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Incompatibilidad de Runtime**: ((Implementada)) Se ha reemplazado `lodash.set` por el nuevo helper nativo `setNestedProperty`, eliminando la dependencia que causaba el fallo de build en el Edge Runtime.
 * 2. **Reducción de Dependencias**: ((Implementada)) Se ha eliminado una dependencia externa (`lodash`), lo que reduce el tamaño del bundle y la superficie de posibles vulnerabilidades.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Errores Granular**: ((Vigente)) En un entorno de producción a gran escala, si un solo archivo de mensajes falla al cargar, el sistema podría continuar con los mensajes cargados exitosamente en lugar de devolver un objeto vacío, aumentando la resiliencia.
 *
 * =====================================================================
 */
// src/i18n.ts
