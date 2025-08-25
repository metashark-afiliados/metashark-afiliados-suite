/**
 * @file src/i18n.ts
 * @description Orquestador de Internacionalización de élite. Ha sido refactorizado
 *              a su arquitectura canónica definitiva. Ahora construye un objeto de
 *              mensajes **aplanado**, que es el patrón más robusto y performante
 *              para `next-intl`. Esta refactorización resuelve la causa raíz de la
 *              cascada de errores `MISSING_MESSAGE` en el entorno de build de Vercel.
 * @author Raz Podestá - MetaShark Tech
 * @version 10.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

import { logger } from "@/lib/logging";
import { type AppLocale, locales } from "@/lib/navigation";
import { messagesManifest } from "@/messages/manifest";

export const defaultLocale: AppLocale = "es-ES";

/**
 * @private
 * @function flattenMessages
 * @description Función pura que toma un objeto de mensajes anidado y lo aplana,
 *              convirtiendo rutas anidadas en claves con notación de punto.
 * @param {Record<string, any>} nestedMessages - El objeto de mensajes anidado.
 * @param {string} [prefix=""] - Prefijo para la recursión.
 * @returns {Record<string, string>} El objeto de mensajes aplanado.
 */
const flattenMessages = (
  nestedMessages: Record<string, any>,
  prefix = ""
): Record<string, string> => {
  return Object.keys(nestedMessages).reduce(
    (messages, key) => {
      const value = nestedMessages[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "string") {
        messages[newKey] = value;
      } else if (typeof value === "object" && value !== null) {
        Object.assign(messages, flattenMessages(value, newKey));
      }

      return messages;
    },
    {} as Record<string, string>
  );
};

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

    // --- INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA: APLANAMIENTO DE MENSAJES ---
    const messages = modules.reduce(
      (acc, module, index) => {
        const namespace = namespaces[index];
        const localeMessages = module.default?.[typedLocale];

        if (localeMessages) {
          // Aplanar el objeto del namespace y fusionarlo en el acumulador.
          // Ej: { "title": "..." } en el namespace "components.Header"
          // se convierte en { "components.Header.title": "..." }
          Object.assign(acc, flattenMessages(localeMessages, namespace));
        } else {
          logger.warn(
            `[I18N] Faltan traducciones para el namespace '${namespace}' en el locale '${typedLocale}'.`
          );
        }
        return acc;
      },
      {} as Record<string, string>
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
 * 1. **Resolución Sistémica de `MISSING_MESSAGE`**: ((Implementada)) La transición a un objeto de mensajes aplanado es la solución arquitectónica definitiva para los errores de `next-intl` en Vercel. Elimina cualquier ambigüedad en la resolución de claves anidadas durante la generación estática y en el cliente.
 * 2. **Cohesión de Código**: ((Implementada)) La lógica de aplanamiento se ha encapsulado en una función helper pura y atómica `flattenMessages` dentro del mismo módulo, mejorando la legibilidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Optimización de Carga**: ((Vigente)) Para aplicaciones a gran escala, se podría implementar una estrategia donde solo se carguen los namespaces necesarios para la página actual, en lugar de todos. Esto requeriría una configuración más granular en cada `page.tsx`.
 *
 * =====================================================================
 */
