// vitest.config.ts
/**
 * @file vitest.config.ts
 * @description Configuración base de Vitest de élite. Calibrada para excluir
 *              explícitamente los tests E2E, garantizando el aislamiento de suites.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
import { defineConfig, mergeConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

import viteConfig from "./vite.config.mjs";

const vitestBaseConfig = defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/config/vitest.setup.ts"],
    exclude: ["node_modules", "dist", ".idea", ".git", "tests/e2e/**"], // <-- CALIBRACIÓN DE ÉLITE
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      reportsDirectory: "./.coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/app/layout.tsx",
        "src/app/**/page.tsx",
        "src/lib/testing/**",
        "src/types/**",
        "**/*.d.ts",
        "**/*.config.ts",
        "**/*.config.mjs",
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});

export default mergeConfig(viteConfig, vitestBaseConfig);

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución Sistémica de Módulos**: ((Implementada)) La integración de `vite-tsconfig-paths` resuelve la causa raíz de todos los errores `TS2307`.
 * 2. **Aislamiento de Suites de Pruebas**: ((Implementada)) Se ha añadido `tests/e2e/**` al array `exclude` del runner de Vitest. Esto resuelve el error de Playwright y refuerza la segregación arquitectónica entre las suites de pruebas.
 *
 * @subsection Melhorias Futuras
 * 1. **Optimización de Exclusiones**: ((Vigente)) La lista de `exclude` de cobertura podría ser refinada para ignorar archivos de solo tipos o manifiestos.
 *
 * =====================================================================
 */
// vitest.config.ts
