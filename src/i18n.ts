// src/i18n.ts
/**
 * @file src/i18n.ts
 * @description Orquestador de Internacionalización de élite. Refactorizado a su
 *              arquitectura canónica para construir un objeto de mensajes ANIDADO,
 *              utilizando el helper `setNestedProperty`. Esta corrección resuelve
 *              la causa raíz sistémica de todos los errores `MISSING_MESSAGE`.
 * @author Raz Podestá - MetaShark Tech
 * @version 12.0.0
 * @date 2025-08-25
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
          // Lógica de anidamiento: Transforma "a.b.c" en { a: { b: { c: ... } } }
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
 * 1. **Resolución Sistémica de `MISSING_MESSAGE`**: ((Implementada)) Se ha reemplazado la lógica de aplanamiento por una de anidamiento usando `setNestedProperty`. Esto construye el objeto de mensajes con la estructura correcta que `next-intl` espera, resolviendo la causa raíz de todos los errores de namespace.
 * 2. **Adhesión a la Arquitectura Canónica**: ((Implementada)) Esta es la implementación correcta y de élite del orquestador para la arquitectura IMAS.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Schema en Tiempo de Build**: ((Vigente)) Se podría integrar la validación del `i18nSchema` de Zod dentro de este archivo. Si los mensajes cargados no coinciden con el schema, el proceso de build fallaría explícitamente.
 *
 * =====================================================================
 */
