// src/config/geoip-map.ts
/**
 * @file src/config/geoip-map.ts
 * @description Manifiesto de Configuración Declarativo. Esta es la Única Fuente de Verdad (SSoT)
 *              para el mapeo de códigos de país (ISO 3166-1 alpha-2) a `AppLocale`.
 *              Externalizar esta configuración permite una gestión y expansión más
 *              sencillas sin modificar la lógica del servicio que la consume. Adhiere
 *              estrictamente al principio de "Configuración sobre Código".
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { type AppLocale } from "@/lib/navigation";

/**
 * @public
 * @constant countryToLocaleMap
 * @description Un registro que mapea códigos de país a su `AppLocale` más probable.
 *              Este mapeo es consumido por el servicio de GeoIP y los manejadores de
 *              detección de idioma del middleware.
 */
export const countryToLocaleMap: Record<string, AppLocale> = {
  // --- América ---
  BR: "pt-BR", // Brasil
  US: "en-US", // Estados Unidos
  CA: "en-US", // Canadá (mayoría habla inglés)
  MX: "es-ES", // México
  AR: "es-ES", // Argentina
  CO: "es-ES", // Colombia
  CL: "es-ES", // Chile
  PE: "es-ES", // Perú

  // --- Europa ---
  ES: "es-ES", // España
  PT: "pt-BR", // Portugal (se prefiere pt-BR por ser el foco principal del proyecto)
  GB: "en-US", // Reino Unido
  IE: "en-US", // Irlanda
  DE: "en-US", // Alemania (inglés como fallback común)
  FR: "en-US", // Francia (inglés como fallback común)

  // --- Oceanía ---
  AU: "en-US", // Australia
  NZ: "en-US", // Nueva Zelanda
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Carga desde Base de Datos**: ((Vigente)) Para una gestión dinámica sin necesidad de redespliegues, este mapeo podría ser cargado desde una tabla `configuration` en Supabase y cacheado agresivamente en el Edge.
 * 2. **Expansión de Cobertura**: ((Vigente)) Añadir más mapeos para países de Asia y África para expandir el alcance global de la detección automática de idioma.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Configuración sobre Código**: ((Implementada)) Se ha desacoplado la configuración de la lógica, mejorando la mantenibilidad y cumpliendo con un principio de diseño de élite. Este aparato es un pilar para la lógica de detección de idioma.
 * 2. **Única Fuente de Verdad (SSoT)**: ((Implementada)) Este archivo se convierte en la SSoT para el mapeo geográfico, proporcionando un punto centralizado para futuras modificaciones.
 *
 * =====================================================================
 */
// src/config/geoip-map.ts
