// src/lib/helpers/object-case-converter.ts
/**
 * @file object-case-converter.ts
 * @description Aparato de utilidad atómico y puro para la conversión de nomenclatura
 *              de claves de objetos. Esta es una pieza fundamental para la
 *              sincronización entre la lógica de la aplicación (camelCase) y la
 *              capa de la base de datos (snake_case).
 * @author L.I.A. Legacy
 * @version 1.1.0
 */

/**
 * @private
 * @function toSnakeCase
 * @description Convierte una string de camelCase o PascalCase a snake_case.
 * @param {string} str - La string a ser convertida.
 * @returns {string} La string convertida en snake_case.
 */
const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * @public
 * @function keysToSnakeCase
 * @description Convierte recursivamente todas las claves de un objeto, incluyendo
 *              objetos anidados y arrays de objetos, de camelCase a snake_case.
 *              Ignora valores nulos y primitivos.
 * @template T - El tipo del objeto de entrada.
 * @param {T} obj - El objeto a ser transformado.
 * @returns {any} Un nuevo objeto con todas las claves en snake_case.
 */
export function keysToSnakeCase<T extends Record<string, any>>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => keysToSnakeCase(v));
  }
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce(
      (acc, key) => {
        const snakeKey = toSnakeCase(key);
        acc[snakeKey] = keysToSnakeCase(obj[key]);
        return acc;
      },
      {} as Record<string, any>
    );
  }
  return obj;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Documentación TSDoc de Élite**: ((Implementada)) Se ha añadido documentación verbosa y precisa a todas las funciones exportadas e internas, mejorando la claridad y mantenibilidad.
 * 2. **Pureza y Atomicidad Validadas**: ((Implementada)) Se ha verificado que el helper es una función pura, sin efectos secundarios, que cumple con el Principio de Responsabilidad Única.
 *
 * @subsection Melhorias Futuras
 * 1. **Función Inversa `keysToCamelCase`**: ((Vigente)) Añadir una función complementaria para transformar los datos que vienen de la base de datos (`snake_case`) a `camelCase` para uso en la aplicación, completando el ciclo de conversión.
 *
 * =====================================================================
 */
// src/lib/helpers/object-case-converter.ts
