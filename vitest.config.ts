// vitest.config.ts
/**
 * @file vitest.config.ts
 * @description Manifiesto de Configuración de Vitest de Élite.
 *              Esta es la Única Fuente de Verdad para la configuración del
 *              entorno de pruebas. Establece un entorno de DOM (`happy-dom`),
 *              resolución de alias, setup global y umbrales de cobertura
 *              mandatorios para garantizar un estándar de calidad mínimo y
 *              prevenir regresiones en la calidad de las pruebas.
 * @author Raz Podestá
 * @version 3.0.0
 */
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

/**
 * @public
 * @exports vitestConfig
 * @description Configuración canónica para el ejecutor de pruebas Vitest.
 */
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./tests/setup.ts",
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "dist", "e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        // Directorios de tipos y configuración
        "src/types",
        "src/lib/types",
        "src/**/*.d.ts",
        "src/i18n.ts",
        "src/config",
        // Puntos de entrada y configuración de instrumentación
        "src/middleware.ts",
        "src/instrumentation.ts",
        "src/instrumentation-client.ts",
        // Páginas de ejemplo de Sentry
        "src/app/sentry-example-page",
        "src/app/api/sentry-example-api",
      ],
      all: true,
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Guardianes de Calidad (Umbrales)**: ((Implementada)) Se han añadido `thresholds` de cobertura del 80%. El pipeline de CI ahora fallará si la calidad de las pruebas disminuye.
 * 2. **Fundación de Pruebas de Élite**: ((Implementada)) Establece una configuración centralizada, escalable y de alto rendimiento para todas las futuras pruebas.
 * 3. **Resolución de Alias**: ((Implementada)) La integración con `vite-tsconfig-paths` permite que las pruebas resuelvan importaciones con alias (`@/`).
 *
 * @subsection Melhorias Futuras
 * 1. **Pools de Pruebas Paralelas**: ((Vigente)) Para proyectos a gran escala, se pueden configurar `pools` para ejecutar diferentes tipos de pruebas (unitarias, integración) en hilos separados, optimizando la velocidad de ejecución.
 * 2. **Reporte de Cobertura para CI**: ((Vigente)) Considerar añadir un reportero de cobertura `lcov` o `cobertura` para una integración avanzada con herramientas de análisis de código como SonarQube o Codecov.
 *
 * =====================================================================
 */
// vitest.config.ts
