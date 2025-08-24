// src/lib/helpers/set-nested-property.helper.ts
/**
 * @file set-nested-property.helper.ts
 * @description Helper atómico y puro para la asignación de propiedades anidadas.
 *              Es una utilidad de propósito general, compatible con cualquier
 *              entorno de JavaScript (cliente, servidor, Edge).
 * @author L.I.A. Legacy
 * @version 1.0.3
 */
// "server-only" ha sido eliminado para compatibilidad universal.

/**
 * @public
 * @function setNestedProperty
 * @description Asigna un valor a una propiedad anidada dentro de un objeto.
 *              Crea las rutas intermedias si no existen.
 * @param {Record<string, any>} obj - El objeto a modificar.
 * @param {string} path - La ruta de la propiedad (ej. "a.b.c").
 * @param {any} value - El valor a asignar.
 * @returns {Record<string, any>} El objeto modificado.
 */
export function setNestedProperty(
  obj: Record<string, any>,
  path: string,
  value: any
): Record<string, any> {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (typeof current[key] !== "object" || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return obj;
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Compatibilidad Universal**: ((Implementada)) Se ha verificado la ausencia de directivas de runtime, asegurando que este helper pueda ser consumido por el orquestador `i18n.ts` durante el build.
 *
 * =====================================================================
 */
// src/lib/helpers/set-nested-property.helper.ts
