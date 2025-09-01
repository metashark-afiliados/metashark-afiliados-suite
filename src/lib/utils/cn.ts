// src/lib/utils/cn.ts
/**
 * @file src/lib/utils/cn.ts
 * @description Aparato de utilidad atómico y SSoT para la construcción
 *              dinámica de clases de Tailwind CSS.
 * @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/utils/cn.ts.md
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @public
 * @function cn
 * @description Combina clases de Tailwind CSS de forma inteligente.
 * @param {...ClassValue[]} inputs - Una secuencia de clases a combinar.
 * @returns {string} La cadena de clases finales, optimizada y sin conflictos.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
// src/lib/utils/cn.ts
