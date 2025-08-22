// vite.config.mjs
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * @fileoverview Configuración de Vite exclusiva para el entorno de pruebas Vitest.
 * @description Este archivo NO se utiliza para el build de producción de Next.js.
 * Su único propósito es configurar el entorno de Vite en el que Vitest se ejecuta,
 * proveyendo las capacidades esenciales para que entienda el código fuente del
 * proyecto.
 */
export default defineConfig({
  plugins: [
    /**
     * @plugin react
     * @description Habilita la transformación de código JSX y TSX. Es indispensable
     * para que Vitest pueda procesar los componentes de React.
     */
    react(),

    /**
     * @plugin tsconfigPaths
     * @description Lee la configuración de `paths` del archivo `tsconfig.json` del
     * proyecto. Esto permite que las pruebas resuelvan correctamente los alias de
     * importación (e.g., `@/components`, `@/hooks`), manteniendo la coherencia
     * con el código de producción.
     */
    tsconfigPaths(),
  ],
});

/**
 * ##################################################################################
 * # CÓDIGO LEGADO                                                                  #
 * ##################################################################################
 *
 * Mejoras implementadas:
 *
 * ((Implementada)) Soporte para React (JSX/TSX): Se integra el plugin oficial de
 *   React para Vite, permitiendo que la suite de pruebas procese componentes.
 * ((Implementada)) Resolución de Alias de TypeScript: Se integra `vite-tsconfig-paths`
 *   para que las importaciones con alias funcionen de forma nativa en las pruebas,
 *   eliminando la necesidad de paths relativos complejos (`../../../`) y
 *   previniendo errores de importación.
 *
 * ##################################################################################
 * # MEJORA CONTINUA                                                                #
 * ##################################################################################
 *
 * Melhorias Futuras:
 *
 * ((Vigente)) Definiciones Globales: Evaluar la necesidad de utilizar la opción `define`
 *   de Vite para inyectar variables de entorno globales específicas para las
 *   pruebas, si fuera necesario desacoplar algún servicio que dependa de ellas.
 *
 */
