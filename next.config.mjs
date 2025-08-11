// next.config.mjs
/**
 * @file Manifiesto de configuración de Next.js
 * @description Configuración canónica y limpia. Se ha eliminado toda la
 *              configuración de logging de terceros para adoptar una solución
 *              más robusta y explícita a nivel de middleware.
 * @author L.I.A Legacy
 * @version 3.0.0
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // No se requiere configuración de logging aquí.
};

export default nextConfig;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Desacoplamento de Infraestrutura**: ((Implementada)) Se ha eliminado la dependencia `next-logger` que causaba inestabilidad, favoreciendo una arquitectura de logging más explícita y controlada.
 *
 * =====================================================================
 */
// next.config.mjs
