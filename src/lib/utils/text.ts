// src/lib/utils/text.ts
/**
 * @file src/lib/utils/text.ts
 * @description Colección de funciones de utilidad de propósito general. Este aparato
 *              proporciona herramientas reutilizables y atómicas que son consumidas
 *              en toda la aplicación, desde componentes de UI hasta manejadores
 *              de middleware.
 *              **Actualizado para incluir `pascalToKebabCase` para nombres de iconos.**
 * @author L.I.A. Legacy
 * @version 1.2.0
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @public
 * @constant protocol
 * @description Determina el protocolo de URL (`http` o `https`) basado en el entorno de Node.js.
 */
export const protocol =
  process.env.NODE_ENV === "production" ? "https" : "http";

/**
 * @public
 * @constant rootDomain
 * @description Define el dominio raíz de la aplicación a partir de variables de entorno,
 *              con un fallback a `localhost:3000` para desarrollo local.
 */
export const rootDomain =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

/**
 * @public
 * @function cn
 * @description Combina clases de Tailwind CSS de forma inteligente. Permite la
 *              aplicación condicional de clases y resuelve automáticamente
 *              conflictos (ej. `p-2` y `p-4` se resuelve a `p-4`).
 * @param {...ClassValue[]} inputs - Una secuencia de clases a combinar.
 * @returns {string} La cadena de clases finales, optimizada y sin conflictos.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

/**
 * @public
 * @function isPrivateIpAddress
 * @description Verifica si una dirección IP dada es una dirección IP privada (LAN).
 *              Esto es útil para evitar realizar lookups de GeoIP en IPs internas
 *              que no son consultables por APIs públicas.
 * @param {string} ip - La dirección IP a verificar.
 * @returns {boolean} `true` si la IP es privada, `false` en caso contrario.
 */
export function isPrivateIpAddress(ip: string): boolean {
  const privateIpRegex =
    /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3})|(172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})|(192\.168\.\d{1,3}\.\d{1,3})|(127\.0\.0\.1)$/;
  return privateIpRegex.test(ip);
}

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

// --- INICIO DE IMPLEMENTACIÓN HOLÍSTICA: pascalToKebabCase ---
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
// --- FIN DE IMPLEMENTACIÓN HOLÍSTICA ---

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.2.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **`pascalToKebabCase` (Utilidad Atómica de Texto)**: ((Implementada)) Se ha añadido esta función pura y atómica para transformar cadenas de texto de `PascalCase` a `kebab-case`. Esto es un helper esencial para generar identificadores y clases CSS consistentes, y es una dependencia crítica para el tooltip de `IconCard.tsx`.
 * 2. **Documentación TSDoc de Élite**: ((Implementada)) Se ha añadido documentación TSDoc verbosa y precisa a la nueva función, detallando su propósito, parámetros y retorno.
 * 3. **No Regresión Funcional**: ((Implementada)) Toda la funcionalidad existente del archivo se mantiene intacta.
 * 4. **Versionado Consistente**: ((Implementada)) Se ha incrementado la versión a `1.2.0` para reflejar esta adición significativa.
 *
 * @subsection Melhorias Futuras
 * 1. **Soporte Unicode Extendido en `slugify`**: ((Vigente)) Para una internacionalización completa, se podría expandir el mapa de caracteres en `slugify` para incluir otros alfabetos (ej. cirílico, griego) si fuera necesario.
 * 2. **Función Inversa `kebabToPascalCase`**: ((Vigente)) Se podría añadir una función complementaria `kebabToPascalCase` para completar la suite de conversión de casos, si se necesitara en el futuro.
 *
 * =====================================================================
 */
