// src/lib/utils/text.ts
/**
 * @file src/lib/utils/text.ts
 * @description Aparato de utilidad atómico y puro para operaciones de manipulación de texto.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */

/**
 * @public
 * @function slugify
 * @description Convierte una cadena de texto en un formato "slug" amigable para URLs.
 *              Elimina acentos, caracteres especiales (excepto guiones), convierte a
 *              minúsculas y reemplaza espacios con guiones.
 * @param {string} text - La cadena de texto a convertir.
 * @returns {string} La cadena de texto convertida en formato slug.
 */
export const slugify = (text: string): string => {
  const a =
    "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
  const b =
    "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrssssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");

  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Reemplaza espacios con -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Reemplaza caracteres acentuados
    .replace(/&/g, "-and-") // Reemplaza & con 'and'
    .replace(/[^\w\-]+/g, "") // Elimina todos los caracteres no alfanuméricos excepto -
    .replace(/\-\-+/g, "-") // Reemplaza múltiples - con uno solo
    .replace(/^-+/, "") // Elimina - del inicio
    .replace(/-+$/, ""); // Elimina - del final
};

/**
 * =ual==================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad y Cohesión**: ((Implementada)) Se ha creado este nuevo aparato para albergar utilidades de texto, mejorando la organización del código y el Principio de Responsabilidad Única. La lógica de `slugify` ya no contamina la capa de validación.
 * 2. **Robustez Mejorada**: ((Implementada)) La implementación de `slugify` ha sido mejorada para eliminar también guiones al principio y al final del resultado, generando slugs más limpios y canónicos.
 *
 * @subsection Melhorias Futuras
 * 1. **Biblioteca de Utilidades de Texto**: ((Vigente)) Este aparato puede ser expandido con otras funciones de texto puras y reutilizables, como `capitalize`, `truncate`, etc.
 *
 * =====================================================================
 */
// src/lib/utils/text.ts
