// src/i18n.ts
/**
 * @file src/i18n.ts
 * @description Orquestador de configuración para `next-intl` (Arquitectura de Élite).
 *              Ha sido corregido para utilizar la ruta de importación canónica
 *              dentro del directorio `src/`, resolviendo un error crítico de
 *              resolución de módulos que impedía el renderizado.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

import { logger } from "@/lib/logging";
import { type AppLocale, locales } from "@/lib/navigation";

export default getRequestConfig(async ({ locale }) => {
  const typedLocale = locale as AppLocale;

  if (!locales.includes(typedLocale)) {
    logger.warn(
      `[I18N Orquestador] Intento de acceso con un locale inválido: "${locale}".`
    );
    notFound();
  }

  // CORRECCIÓN: La ruta ahora es relativa al directorio `src/`, no a la raíz del proyecto.
  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Corrección de Ruta Canónica**: ((Implementada)) Se ha corregido la ruta de importación de `../messages/` a `./messages/`. Esto resuelve el error de carga de módulos y, en consecuencia, el error 404 global.
 *
 * @subsection Melhorias Futuras
 * 1. **Uso de Alias de TS**: ((Vigente)) Para una robustez aún mayor, la importación podría usar un alias de TypeScript (`@/messages/${locale}.json`), eliminando cualquier ambigüedad de rutas relativas.
 *
 * =====================================================================
 */
// src/i18n.ts
