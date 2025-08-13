// src/i18n.ts
/**
 * @file src/i18n.ts
 * @description Orquestador de configuración para `next-intl`. Carga dinámicamente
 *              el archivo de mensajes consolidado para el locale de la petición actual.
 *              Esta es la SSoT para la obtención de mensajes en el servidor. Ha sido
 *              actualizado para establecer 'es-ES' como el idioma por defecto.
 * @author L.I.A. Legacy
 * @version 3.1.0
 */
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

import { logger } from "@/lib/logging";
import { type AppLocale, locales } from "@/lib/navigation";

// Define un locale por defecto explícito y canónico para toda la aplicación.
export const defaultLocale: AppLocale = "es-ES";

export default getRequestConfig(async ({ locale }) => {
  const typedLocale = locale as AppLocale;

  if (!locales.includes(typedLocale)) {
    logger.warn(
      `[I18N Orquestador] Intento de acceso con un locale inválido: "${locale}".`
    );
    notFound();
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Fallback de Mensajes**: ((Vigente)) Investigar la configuración de `next-intl` para implementar un sistema de fallback. Si una clave no se encuentra en `es-ES.json`, podría intentar buscarla en `en-US.json` antes de lanzar un error, haciendo la UI más resiliente a traducciones incompletas.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Definición de `defaultLocale` SSoT**: ((Implementada)) Se ha exportado `defaultLocale` para que pueda ser consumido por el middleware, creando una única fuente de verdad para el idioma por defecto.
 * 2. **Alineación con Requisitos de Negocio**: ((Implementada)) Se ha actualizado el `defaultLocale` a 'es-ES', cumpliendo con la nueva directiva y corrigiendo el comportamiento de redirección del middleware.
 *
 * =====================================================================
 */
// src/i18n.ts
