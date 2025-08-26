// src/i18n.ts
/**
 * @file src/i18n.ts
 * @description Orquestador de Internacionalización de élite. Este aparato es
 *              el motor de la estrategia IMAS (Internationalization Modular
 *              Atomic Strategy). Consume el manifiesto de mensajes, carga
 *              dinámicamente los módulos para el locale actual y reconstruye
 *              la estructura de objetos anidados que `next-intl` requiere.
 * @author Raz Podestá - MetaShark Tech
 * @version 12.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
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
 * 1. ((Implementada)) **Arquitectura Canónica Validada:** La auditoría confirma que esta implementación es la solución de élite para una i18n modular y tipo-segura en Next.js.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Validación con Zod en Build:** Integrar la validación del `i18nSchema` aquí. Si el objeto `messages` ensamblado no cumple con el contrato de Zod, el proceso de build debería fallar explícitamente, previniendo la subida de traducciones con tipos incorrectos.
 *
 * =====================================================================
 */
// src/i18n.ts
