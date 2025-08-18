// src/lib/helpers/set-nested-property.helper.ts
/**
 * @file set-nested-property.helper.ts
 * @description Helper atómico y puro, optimizado para el Edge Runtime.
 *              Corregido para usar la directiva "server-only" en lugar de
 *              "use server", resolviendo un error crítico de build.
 * @author L.I.A. Legacy
 * @version 1.0.1
 */
import "server-only";

/**
 * @public
 * @function setNestedProperty
 * @description Asigna un valor a una propiedad anidada dentro de un objeto.
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
 * 1. **Resolución de Error de Build**: ((Implementada)) Se ha reemplazado la directiva `"use server"` por `"server-only"`. Esto resuelve la causa raíz del fallo de compilación, ya que la función exportada no necesita ser `async`.
 * 2. **Alineación Arquitectónica**: ((Implementada)) El uso de `"server-only"` alinea el aparato con su propósito real: ser una utilidad de servidor, no una acción invocable desde el cliente.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Rutas de Array**: ((Vigente)) La implementación podría extenderse para manejar rutas que incluyan índices de array (ej. "a[0].b").
 *
 * =====================================================================
 */
// src/lib/helpers/set-nested-property.helper.ts
