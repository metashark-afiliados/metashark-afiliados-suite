// src/i18n.ts
/**
 * @file src/i18n.ts
 * @description Orquestador de Internacionalización de élite. Ha sido
 *              refactorizado a su arquitectura canónica. Ahora construye un
 *              objeto de mensajes ANIDADO, que es la estructura requerida por
 *              `next-intl` para resolver correctamente los namespaces. Esto
 *              resuelve la causa raíz de la cascada de errores `MISSING_MESSAGE`.
 * @author Raz Podestá
 * @version 9.0.0
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

    // --- INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA ---
    // Construye un objeto anidado, no aplanado.
    const messages = modules.reduce(
      (acc, module, index) => {
        const namespace = namespaces[index];
        const localeMessages = module.default?.[typedLocale];

        if (localeMessages) {
          // Usa el helper para crear la estructura anidada.
          // Ej: namespace "components.layout.DashboardSidebar"
          // crea acc.components.layout.DashboardSidebar = { ... }
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
    // --- FIN DE REFACTORIZACIÓN ARQUITECTÓNICA ---

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
 * 1. **Resolución Sistémica de `MISSING_MESSAGE`**: ((Implementada)) Se ha restaurado la lógica de ensamblaje anidado. Esto resuelve de forma definitiva el error de Vercel y alinea nuestra implementación con el comportamiento esperado por `next-intl`.
 *
 * =====================================================================
 */
// src/i18n.ts
