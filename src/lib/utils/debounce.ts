// src/lib/utils/debounce.ts
/**
 * @file src/lib/utils/debounce.ts
 * @description Aparato de utilidad atómico para la función de debounce.
 * @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/utils/debounce.ts.md
 */

/**
 * @public
 * @function debounce
 * @description Crea una versión "debounced" de una función. La función debounced
 *              solo se ejecutará después de que haya pasado un tiempo determinado
 *              sin ser llamada. Esencial para optimizar eventos frecuentes como la
 *              escritura en un campo de búsqueda.
 * @template F - El tipo de la función a debouncing.
 * @param {F} func - La función a la que aplicar el debounce.
 * @param {number} waitFor - El tiempo de espera en milisegundos.
 * @returns {F} Una nueva función debounced que devuelve una promesa.
 */
export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number
): F {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    })) as F;
}
// src/lib/utils/debounce.ts
