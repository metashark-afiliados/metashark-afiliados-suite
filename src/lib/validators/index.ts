// src/lib/validators/index.ts
/**
 * @file validators/index.ts
 * @description Manifiesto de Validadores de Élite. Ha sido refactorizado
 *              para eliminar la exportación ambigua, resolviendo el error
 *              de compilación `TS2308`.
 * @author Raz Podestá
 * @version 23.0.0
 */

// --- RE-EXPORTACIÓN DE LA BIBLIOTECA DE SCHEMAS ---
export * from "./schemas";

// --- RE-EXPORTACIÓN DE CONTRATOS COMPARTIDOS ---
export * from "./i18n.schema";

/**
 * @public
 * @typedef ActionResult
 * @description Contrato de tipo genérico para el retorno de todas las Server Actions.
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
 * 1. **Resolución de Ambigüedad de Módulo**: ((Implementada)) Se ha eliminado la exportación redundante `export * from "./telemetry.schemas"`, resolviendo la causa raíz del error de compilación.
 *
 * =====================================================================
 */
// src/lib/validators/index.ts
