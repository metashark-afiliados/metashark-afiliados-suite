// src/lib/helpers/correlation-id.helper.ts
/**
 * @file correlation-id.helper.ts
 * @description Aparato de infraestructura atómico y SSoT para la gestión de
 *              IDs de correlación a través de `AsyncLocalStorage`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 * @see .docs-espejo/lib/helpers/correlation-id.helper.ts.md
 */
import "server-only";

import { AsyncLocalStorage } from "node:async_hooks";

/**
 * @private
 * @constant asyncStorage
 * @description Instancia de `AsyncLocalStorage` para almacenar el ID de correlación.
 */
const asyncStorage = new AsyncLocalStorage<{ correlationId: string }>();

/**
 * @public
 * @function getCorrelationId
 * @description Obtiene el ID de correlación del contexto asíncrono actual.
 * @returns {string | undefined} El ID de correlación, o undefined si no está en el contexto.
 */
export function getCorrelationId(): string | undefined {
  return asyncStorage.getStore()?.correlationId;
}

/**
 * @public
 * @function withCorrelationId
 * @description Ejecuta una función dentro de un nuevo contexto asíncrono con un ID de correlación.
 * @template R - El tipo de retorno de la función a ejecutar.
 * @param {() => R} fn - La función a ejecutar.
 * @param {string} [correlationId] - Un ID de correlación existente o uno nuevo será generado.
 * @returns {R} El resultado de la ejecución de la función `fn`.
 */
export function withCorrelationId<R>(fn: () => R, correlationId?: string): R {
  const id = correlationId || `req-${crypto.randomUUID()}`;
  return asyncStorage.run({ correlationId: id }, fn);
}
// src/lib/helpers/correlation-id.helper.ts
