// src/lib/validators/index.ts
/**
 * @file validators/index.ts
 * @description Manifiesto de Validadores de Élite. Refactorizado para
 *              enriquecer el contrato `ActionResult`, permitiendo que los
 *              resultados de error devuelvan un payload de datos opcional.
 *              Esto resuelve errores de tipo sistémicos y permite un manejo
 *              de errores más rico.
 * @author Raz Podestá
 * @version 26.0.0
 */

export * from "./schemas";
export * from "./i18n.schema";

/**
 * @public
 * @typedef ActionResult
 * @description Contrato de tipo genérico para el retorno de todas las Server Actions.
 *              La rama de error ahora puede incluir un `data` opcional.
 * @template TSuccess - El tipo de los datos en caso de éxito.
 * @template TErrorData - El tipo de los datos opcionales en caso de error.
 */
export type ActionResult<TSuccess, TErrorData = unknown> =
  | { success: true; data: TSuccess }
  | { success: false; error: string; data?: TErrorData };

/**
 * @public
 * @function isActionError
 * @description Guardián de tipo que verifica si un valor es un `ActionResult` de error.
 * @param {unknown} result - El valor a verificar.
 * @returns {result is { success: false; error: string; data?: unknown }}
 */
export function isActionError(
  result: unknown
): result is { success: false; error: string; data?: unknown } {
  if (typeof result !== "object" || result === null) {
    return false;
  }
  const obj = result as Record<string, unknown>;
  return obj.success === false && typeof obj.error === "string";
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución Sistémica de Errores de Tipo**: ((Implementada)) Se ha modificado el contrato `ActionResult` para permitir un `data` opcional en el caso de error. Esta es la corrección fundamental que resuelve la causa raíz de los errores `TS2339` y `TS2353`.
 * 2. **Contrato de Datos Flexible y Robusto**: ((Implementada)) El nuevo contrato genérico (`ActionResult<TSuccess, TErrorData>`) permite un tipado estricto tanto para los datos de éxito como para los de error, mejorando la seguridad de tipos en toda la aplicación.
 *
 * @subsection Melhorias Futuras
 * 1. **Guardián `isActionSuccess`**: ((Vigente)) Complementar con un guardián de tipo `isActionSuccess` para verificar los resultados exitosos de forma segura.
 *
 * =====================================================================
 */
// src/lib/validators/index.ts
