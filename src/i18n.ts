// src/i18n.ts
/**
 * @file src/i18n.ts
 * @description Orquestador de Internacionalización de élite. Refactorizado a su
 *              arquitectura canónica para construir un objeto de mensajes ANIDADO,
 *              resolviendo la causa raíz de los errores `MISSING_MESSAGE` en Vercel.
 * @author Raz Podestá - MetaShark Tech
 * @version 11.0.0
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
 * 1. **Resolución Sistémica de `MISSING_MESSAGE`**: ((Implementada)) Se ha eliminado la lógica de aplanamiento. El orquestador ahora construye un objeto de mensajes anidado, que es el contrato esperado por `next-intl`, resolviendo el error de build.
 * 2. **Uso de Helper Atómico**: ((Implementada)) Se utiliza el helper `setNestedProperty` para construir el objeto anidado, adhiriéndose al principio DRY y reutilizando lógica existente.
 * 3. **Arquitectura Resiliente y Mantenible**: ((Implementada)) Esta estructura es más simple, más fácil de depurar y se alinea directamente con la forma en que los desarrolladores consumen las traducciones.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga Selectiva de Namespaces**: ((Vigente)) Para una optimización de élite, se podría modificar la configuración de `next-intl` en cada `page.tsx` para solicitar únicamente los namespaces que esa página necesita, reduciendo el payload de mensajes inicial.
 * 2. **Validación de Schema en Tiempo de Build**: ((Vigente)) Se podría integrar la validación del `i18nSchema` de Zod dentro de este archivo. Si los mensajes cargados no coinciden con el schema, el proceso de build fallaría explícitamente, previniendo errores de i18n en producción.
 *
 * =====================================================================
 */
// src/i18n.ts
