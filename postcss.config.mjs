// postcss.config.mjs
/**
 * @file postcss.config.mjs
 * @description Configuración canónica de PostCSS para Tailwind CSS v4.
 *              Este aparato ha sido validado y nivelado para utilizar el plugin
 *              `@tailwindcss/postcss`, alineándose con la nueva arquitectura de
 *              dependencias de Tailwind v4.1 y resolviendo el error de
 *              compilación de estilos.
 * @author Raz Podestá
 * @version 2.1.0
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};

export default config;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación con Tailwind v4.1**: ((Implementada)) Se ha validado y confirmado el uso del nuevo paquete `@tailwindcss/postcss`. Esta corrección resuelve la causa raíz del error de compilación de estilos.
 *
 * @subsection Melhorias Futuras
 * 1. **Plugins Adicionales**: ((Vigente)) Este es el lugar canónico para añadir futuros plugins de PostCSS si fueran necesarios, como `postcss-nesting`.
 *
 * =====================================================================
 */
// postcss.config.mjs
