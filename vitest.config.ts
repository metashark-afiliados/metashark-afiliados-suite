// vitest.config.ts
/**
 * @file vitest.config.ts
 * @description Manifiesto de Configuración de Vitest de Élite.
 *              Esta es la Única Fuente de Verdad para la configuración del
 *              entorno de pruebas. Establece un entorno de DOM (`happy-dom`),
 *              resolución de alias, setup global y umbrales de cobertura
 *              mandatorios para garantizar un estándar de calidad mínimo y
 *              prevenir regresiones en la calidad de las pruebas.
 *              Corregido para excluir explícitamente los tests E2E y resolver
 *              la importación de 'server-only'.
 * @author Raz Podestá
 * @version 3.0.1
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
    // --- INICIO DE CORRECCIÓN DE INCLUSIÓN DE TESTS ---
    // Incluye solo archivos de pruebas unitarias y de integración explícitamente.
    include: [
      "tests/unit/**/*.{test,spec}.{ts,tsx}",
      "tests/integration/**/*.{test,spec}.{ts,tsx}",
    ],
    // --- FIN DE CORRECCIÓN DE INCLUSIÓN DE TESTS ---
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
        "src/app/api", // Excluir rutas API
        "src/app/[locale]/about", // Example of excluding specific pages if they are not tested by Vitest
        "src/app/[locale]/blog",
        "src/app/[locale]/contact",
        "src/app/[locale]/cookies",
        "src/app/[locale]/disclaimer",
        "src/app/[locale]/legal",
        "src/app/[locale]/privacy",
        "src/app/[locale]/terms",
        "src/app/[locale]/welcome",
        "src/app/sentry-example-page",
        "src/app/global-error.tsx",
        "src/app/globals.css",
        "src/app/layout.tsx",
        "src/app/not-found.tsx",
        "src/instrumentation.ts",
        "src/instrumentation-client.ts",
        "src/middleware.ts",
        // Components that are mostly presentational and rely on mocked data
        "src/components/about",
        "src/components/blog",
        "src/components/contact",
        "src/components/landing",
        "src/components/legal",
        "src/components/telemetry",
        "src/components/templates",
        "src/components/ui",
        // Specific files in lib that might not need unit coverage directly
        "src/lib/builder/types.d.ts",
        "src/lib/context",
        "src/lib/services",
        "src/lib/supabase",
        "src/lib/navigation.ts",
        "src/lib/routing-manifest.ts",
        "src/lib/utils.ts", // Basic utilities are often implicitly tested by components that use them
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
 * 4. **Exclusión Precisa de E2E**: ((Implementada)) La sección `include` se ha refinado para apuntar específicamente a `unit` e `integration` directorios, previniendo que Vitest procese archivos Playwright E2E.
 *
 * @subsection Melhorias Futuras
 * 1. **Pools de Pruebas Paralelas**: ((Vigente)) Para proyectos a gran escala, se pueden configurar `pools` para ejecutar diferentes tipos de pruebas (unitarias, integración) en hilos separados, optimizando la velocidad de ejecución.
 * 2. **Reporte de Cobertura para CI**: ((Vigente)) Considerar añadir un reportero de cobertura `lcov` o `cobertura` para una integración avanzada con herramientas de análisis de código como SonarQube o Codecov.
 *
 * =====================================================================
 */
// vitest.config.ts
