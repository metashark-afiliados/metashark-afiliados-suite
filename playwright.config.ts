// playwright.config.ts
/**
 * @file playwright.config.ts
 * @description Configuración canónica para la suite de pruebas E2E con Playwright.
 *              Nivelada para incluir pruebas cross-browser, garantizando una
 *              experiencia de usuario consistente en las plataformas principales.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  globalSetup: "./tests/e2e/global-setup.ts",
  use: {
    baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    storageState: "./tests/e2e/storageState.json", // Usar el estado de sesión guardado
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
  },
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Pruebas Cross-Browser**: ((Implementada)) Se han añadido proyectos para Firefox y WebKit, garantizando que las pruebas E2E se ejecuten en los tres motores de renderizado principales.
 * 2. **Persistencia de Sesión Activada**: ((Implementada)) La configuración `use.storageState` está ahora activa, permitiendo que el `global-setup` acelere la suite de pruebas.
 *
 * @subsection Melhorias Futuras
 * 1. **Perfiles Móviles**: ((Vigente)) Añadir proyectos para dispositivos móviles (`devices['Pixel 5']`, `devices['iPhone 12']`) para validar la experiencia responsiva.
 *
 * =====================================================================
 */
// playwright.config.ts
