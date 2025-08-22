// src/lib/validators/index.ts
/**
 * @file validators/index.ts
 * @description Manifiesto de Validadores de Élite. Ha sido refactorizado
 *              para incluir un "guardián de tipo" (`isActionError`) redefinido, lo que
 *              mejora la seguridad de tipos y la capacidad de `type narrowing`
 *              para el `ActionResult` en toda la aplicación de forma robusta.
 * @author Raz Podestá
 * @version 25.0.0
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

// --- INICIO DE MEJORA: REDEFINICIÓN DEL "TYPE GUARD" ---
/**
 * @public
 * @function isActionError
 * @description Un "guardián de tipo" que verifica si un valor `unknown` (o `any`)
 *              es un objeto con la forma `{ success: false; error: string }`.
 *              Es fundamental para realizar un `type narrowing` seguro en TypeScript,
 *              evitando las ambigüedades de la unión `ActionResult`.
 * @param {unknown} result - El valor a verificar.
 * @returns {result is { success: false; error: string }}
 *          `true` si el valor es un objeto con `success: false` y `error: string`,
 *          `false` en caso contrario.
 */
export function isActionError(
  result: unknown
): result is { success: false; error: string } {
  // Primero, asegurar que es un objeto no nulo
  if (typeof result !== "object" || result === null) {
    return false;
  }

  // Ahora, podemos usar 'in' para comprobar la existencia de las propiedades
  // y luego estrechar los tipos basándonos en esas comprobaciones.
  const obj = result as Record<string, unknown>; // Castear a un Record genérico para comprobar propiedades

  return obj.success === false && typeof obj.error === "string";
}
// --- FIN DE MEJORA ---

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Redefinición Robusta del "Type Guard" (`isActionError`)**: ((Implementada)) La función `isActionError` ha sido reescrita para verificar directamente la forma `{ success: false; error: string }`. Esto resuelve el error `TS2339` que ocurría dentro del propio guardián y proporciona un `type narrowing` mucho más efectivo y menos ambiguo para TypeScript, alineándose con las mejores prácticas.
 * 2. **Consistencia de la SSoT**: ((Implementada)) El "type guard" se mantiene en `src/lib/validators/index.ts`, la "Única Fuente de Verdad" para los validadores y contratos compartidos.
 * 3. **No Regresión**: ((Implementada)) Este cambio mejora la seguridad de tipos sin alterar la lógica de negocio ni introducir comportamientos no deseados.
 *
 * @subsection Melhorias Futuras
 * 1. **"Guardián de Tipo" `isActionSuccess`**: ((Vigente)) Complementar con un "type guard" `isActionSuccess` que verifique `ActionResult` de éxito (`success: true; data: T`).
 * 2. **Tipado Estricto de Claves de Error**: ((Vigente)) Refinar el tipo `error: string` en `ActionResult` para que sea `keyof typeof ValidationErrorsSchema` o un `z.enum` de todas las claves de error de i18n válidas. Esto permitiría al `isActionError` hacer una comprobación más estricta sobre el contenido del `error`.
 * 3. **Documentación del Type Guard**: ((Vigente)) Añadir ejemplos de uso de `isActionError` en la documentación del mismo para mostrar claramente cómo y dónde debe ser utilizado.
 *
 * =====================================================================
 */
// src/lib/validators/index.ts
