// src/lib/utils/text.ts
/**
 * @file src/lib/utils/text.ts
 * @description Aparato de utilidades atómicas para la manipulación de texto.
 * @author L.I.A. Legacy
 * @version 1.1.0
 */

/**
 * @public
 * @function slugify
 * @description Convierte un string en un slug URL-friendly. Normaliza,
 *              translitera caracteres especiales a sus equivalentes ASCII,
 *              reemplaza espacios por guiones y limpia caracteres no válidos.
 * @param {string} text - El texto de entrada.
 * @returns {string} El texto convertido en slug.
 */
export const slugify = (text: string): string => {
  const a =
    "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
  const b =
    "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");

  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Reemplazar espacios con -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Reemplazar caracteres especiales
    .replace(/&/g, "-and-") // Reemplazar & con 'and'
    .replace(/[^\w-]+/g, "") // Eliminar caracteres inválidos
    .replace(/--+/g, "-") // Colapsar guiones múltiples
    .replace(/^-+/, "") // Recortar guiones del inicio
    .replace(/-+$/, ""); // Recortar guiones del final
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Lógica de Transliteración Robusta**: ((Implementada)) Se reemplazó la dependencia de `normalize` por un mapa de caracteres explícito, garantizando una conversión 1:1 correcta y eliminando la regresión.
 *
 * @subsection Melhorias Futuras
 * 1. **Soporte Unicode Extendido**: ((Vigente)) Para una internacionalización completa, se podría expandir el mapa de caracteres para incluir otros alfabetos (ej. cirílico, griego) si fuera necesario.
 *
 * =====================================================================
 */
// src/lib/utils/text.ts
