// src/lib/helpers/set-nested-property.helper.ts
/**
 * @file set-nested-property.helper.ts
 * @description Helper atómico y puro para la asignación de propiedades anidadas.
 *              Esta es una utilidad de propósito general y ha sido corregida para
 *              eliminar la directiva "server-only", lo que permite su uso tanto
 *              en el servidor como en los entornos de pruebas cliente, resolviendo
 *              un error de compatibilidad.
 * @author L.I.A. Legacy
 * @version 1.0.2
 */
// REMOVED: "server-only"; (Ya no es necesario y causaba problemas en los tests)

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
 * 1. **Compatibilidad Universal**: ((Implementada)) Se ha eliminado la directiva `"server-only"`. Este helper es una utilidad pura de manipulación de objetos que no interactúa con recursos de servidor ni API de Node.js, por lo que puede usarse de forma segura en cualquier entorno (cliente, servidor, Edge, tests). Esta corrección resuelve el problema de carga en el entorno de pruebas.
 * 2. **Alineación de Testing**: ((Implementada)) Al permitir que `tests/utils/i18n.ts` importe directamente esta función, se garantiza que la estructura de los mensajes cargados para las pruebas sea idéntica a la que `src/i18n.ts` crea en producción, resolviendo el `IntlError`.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Rutas de Array**: ((Vigente)) La implementación podría extenderse para manejar rutas que incluyan índices de array (ej. "a[0].b").
 *
 * =====================================================================
 */
// src/lib/helpers/set-nested-property.helper.ts
