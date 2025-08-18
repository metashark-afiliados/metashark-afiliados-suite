// src/lib/validators/index.ts
/**
 * @file validators/index.ts
 * @description Manifiesto de Validadores de Élite y ensamblador principal.
 *              Este aparato es la Única Fuente de Verdad (SSoT) que exporta
 *              todos los contratos de datos y reglas de validación de la aplicación.
 *              Ha sido refactorizado para ser un ensamblador puro, delegando la
 *              definición de schemas a módulos atómicos para máxima cohesión.
 * @author Raz Podestá
 * @version 21.0.0
 */

// --- RE-EXPORTACIÓN DE LA BIBLIOTECA DE SCHEMAS ---
export * from "./schemas";

// --- RE-EXPORTACIÓN DE CONTRATOS COMPARTIDOS ---
export * from "./i18n.schema";

/**
 * @public
 * @typedef ActionResult
 * @description Contrato de tipo genérico para el retorno de todas las Server Actions.
 *              Define una unión discriminada para resultados exitosos o fallidos.
 * @template T - El tipo de los datos devueltos en caso de éxito.
 */
export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cohesión y SRP (Principio de Responsabilidad Única)**: ((Implementada)) Este archivo ahora actúa como un ensamblador puro, delegando la definición de schemas a `schemas.ts`. Esto mejora drásticamente la organización y la mantenibilidad de la capa de validación.
 * 2. **Cero Regresiones**: ((Implementada)) La refactorización es estructural y no funcional. Todas las exportaciones del archivo original se han mantenido, garantizando que no haya regresiones en los aparatos consumidores.
 * 3. **Documentación de Élite**: ((Implementada)) La documentación TSDoc ha sido mejorada para reflejar la nueva arquitectura y el propósito de este aparato como ensamblador.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Este tipo de archivo barril/ensamblador es un candidato ideal para ser generado y mantenido por un script de build, eliminando la necesidad de actualizaciones manuales.
 *
 * =====================================================================
 */
// src/lib/validators/index.ts
