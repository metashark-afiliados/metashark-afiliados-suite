// playwright.config.ts
/**
 * @file playwright.config.ts
 * @description Configuración canónica y de élite para Playwright. Refactorizada
 *              para ser agnóstica al entorno, utilizando dinámicamente la URL
 *              de Vercel en CI/CD y localhost en desarrollo local.
 * @author Raz Podestá
 * @version 3.0.0
 */
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

// --- INICIO DE REFACTORIZACIÓN: Lógica de baseURL Dinámica ---
const baseURL = process.env.CI
  ? process.env.NEXT_PUBLIC_SITE_URL || // La URL inyectada por el workflow
    `https://${process.env.VERCEL_URL}` // Fallback a la variable de Vercel
  : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

console.log(`[Playwright Config] Usando baseURL: ${baseURL}`);
// --- FIN DE REFACTORIZACIÓN ---

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  globalSetup: "./tests/e2e/global-setup.ts",
  use: {
    baseURL, // Utilizar la URL dinámica
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
  webServer: process.env.CI
    ? undefined // No iniciar un servidor web local en CI
    : {
        command: "pnpm dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        stdout: "ignore",
        stderr: "pipe",
        timeout: 120 * 1000,
      },
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Agnosticismo de Entorno**: ((Implementada)) La configuración ahora detecta si está en un entorno de CI y ajusta la `baseURL` y la configuración de `webServer` dinámicamente. Esto resuelve el problema de hardware y establece una arquitectura de pruebas E2E de nivel de producción.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Vercel URL**: ((Vigente)) La variable `VERCEL_URL` no incluye el protocolo. Una mejora sería construir la URL completa: `https://${process.env.VERCEL_URL}`.
 *
 * =====================================================================
 */
// playwright.config.ts
