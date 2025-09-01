// src/config/site.config.ts
/**
 * @file src/config/site.config.ts
 * @description Manifiesto de configuración y SSoT para las variables de
 *              entorno relacionadas con el dominio y protocolo del sitio.
 * @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/config/site.config.ts.md
 */

/**
 * @public
 * @constant protocol
 * @description Determina el protocolo de URL (`http` o `https`) basado en el entorno.
 */
export const protocol =
  process.env.NODE_ENV === "production" ? "https" : "http";

/**
 * @public
 * @constant rootDomain
 * @description Define el dominio raíz de la aplicación, con fallback a localhost.
 */
export const rootDomain =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
// src/config/site.config.ts
