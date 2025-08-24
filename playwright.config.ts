// playwright.config.ts
/**
 * @file playwright.config.ts
 * @description Configuración canónica para la suite de pruebas E2E con Playwright.
 *              Nivelada para aumentar el timeout del servidor web, garantizando
 *              un arranque fiable del entorno de desarrollo antes de ejecutar las pruebas.
 * @author Raz Podestá
 * @version 2.1.0
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
    storageState: "./tests/e2e/storageState.json",
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
    // --- INICIO DE CORRECCIÓN DE TIMEOUT ---
    timeout: 120 * 1000, // Aumentado a 120 segundos (2 minutos)
    // --- FIN DE CORRECCIÓN DE TIMEOUT ---
  },
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Estabilidad del Entorno E2E**: ((Implementada)) Se ha aumentado el `timeout` del servidor web a 120 segundos, resolviendo el error `Timed out waiting 60000ms` y haciendo que la suite de pruebas E2E sea robusta ante compilaciones iniciales lentas.
 *
 * @subsection Melhorias Futuras
 * 1. **Health Check Endpoint**: ((Vigente)) Para una solución de élite superior, se podría crear un endpoint de "health check" en la aplicación (`/api/health`) y configurar `webServer.url` para que apunte a él. Esto haría que Playwright espere a que la aplicación esté realmente lista para responder, en lugar de depender de un tiempo fijo.
 *
 * =====================================================================
 */
// playwright.config.ts
