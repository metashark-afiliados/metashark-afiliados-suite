// src/lib/validators/i18n/ThemeSwitcher.schema.ts
/**
 * @file src/lib/validators/i18n/ThemeSwitcher.schema.ts
 * @description Define el contrato de datos atómico para el namespace de internacionalización
 *              'ThemeSwitcher', utilizando Zod para una validación estricta y tipo-segura.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

/**
 * @public
 * @constant ThemeSwitcherSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones relacionadas con el componente `ThemeSwitcher`.
 */
export const ThemeSwitcherSchema = z.object({
  /** Texto para el `aria-label` del botón principal, para accesibilidad. */
  toggleTheme: z.string(),
  /** Opción para seleccionar el tema claro. */
  light: z.string(),
  /** Opción para seleccionar el tema oscuro. */
  dark: z.string(),
  /** Opción para seguir el tema del sistema operativo. */
  system: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Namespace Atómico**: ((Implementada)) Se ha creado este schema para definir explícitamente el contrato del namespace `ThemeSwitcher`.
 * 2. **Principio de Responsabilidad Única (SRP)**: ((Implementada)) Este archivo tiene la única responsabilidad de definir la forma de los datos para su namespace.
 *
 * @subsection Melhorias Futuras
 * 1. **Descripciones Detalladas (`.describe()` de Zod)**: ((Vigente)) Se podría añadir `.describe()` a cada campo del schema para generar automáticamente documentación o tooltips para traductores.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/ThemeSwitcher.schema.ts
