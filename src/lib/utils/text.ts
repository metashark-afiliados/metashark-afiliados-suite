// src/lib/utils/text.ts
/**
 * @file src/lib/utils/text.ts
 * @description Aparato de utilidad atómico y SSoT para todas las funciones
 *              de transformación y manipulación de texto.
 * @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/utils/text.ts.md
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
 * @public
 * @function pascalToKebabCase
 * @description Convierte una string de PascalCase (ej. "ArrowRightLeft") a kebab-case (ej. "arrow-right-left").
 *              Es útil para generar nombres de clases CSS o identificadores de HTML a partir de nombres de componentes/iconos.
 * @param {string} str - La string en PascalCase a ser convertida.
 * @returns {string} La string convertida en kebab-case.
 */
export const pascalToKebabCase = (str: string): string => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
};
// src/lib/utils/text.ts
