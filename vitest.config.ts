// vitest.config.ts
/**
 * @file vitest.config.ts
 * @description Manifiesto de Configuración de Vitest Definitivo v13.1.0.
 *              Esta es la Única Fuente de Verdad para la configuración del entorno de pruebas.
 *              Define los plugins, el entorno de ejecución (jsdom), la ubicación del
 *              setup global, las rutas de inclusión/exclusión y las directivas de
 *              cobertura de código de élite.
 * @author Raz Podestá
 * @version 13.1.0
 */
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/config/vitest.setup.ts",
    include: [
      "tests/unit/**/*.{test,spec}.{ts,tsx}",
      "tests/integration/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["node_modules", ".next", "dist", "tests/e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        // --- Archivos de Configuración y Tipos ---
        "**/*.config.{ts,mjs,js}",
        "src/i18n.ts",
        "**/*.d.ts",
        "src/types",
        "src/lib/types",
        // --- Archivos Barril (Manifiestos de Exportación) ---
        "src/**/index.ts",
        "src/messages/manifest.ts",
        // --- Aparatos de Enrutamiento e Infraestructura ---
        "src/lib/navigation.ts",
        "src/lib/routing-manifest.ts",
        "src/middleware/**",
        "src/app/**/{layout,page,not-found,global-error}.tsx",
        "src/instrumentation*.ts",
        // --- Código de Diagnóstico y Ejemplos ---
        "src/app/api/sentry-example-api/**",
        "src/app/sentry-example-page/**",
        // --- Exclusiones de Pruebas ---
        "tests/**",
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
 * 1. **Exclusiones de Cobertura Granulares**: ((Implementada)) Se ha perfeccionado la lista `coverage.exclude` para ignorar archivos que no contienen lógica de negocio testable (configs, tipos, barrels), proporcionando una métrica de cobertura más precisa y significativa.
 * 2. **Documentación de Élite**: ((Implementada)) El archivo ahora contiene documentación TSDoc exhaustiva que explica su propósito y el de sus directivas clave.
 *
 * @subsection Melhorias Futuras
 * 1. **Wrapper de Renderizado Global**: ((Vigente)) Para optimizar aún más la DX, se podría explorar la propiedad `test.wrapper` de Vitest para aplicar un wrapper global a todas las pruebas de componentes, aunque el `render` personalizado actual ya ofrece una solución robusta.
 *
 * =====================================================================
 */
// vitest.config.ts
