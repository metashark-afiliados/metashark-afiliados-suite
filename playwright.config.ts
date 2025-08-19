// playwright.config.ts
/**
 * @file playwright.config.ts
 * @description Configuración canónica para la suite de pruebas E2E con Playwright.
 *              Alineada con la estrategia de entorno único, utiliza `.env.local`
 *              como la SSoT para las pruebas locales y el comando `pnpm dev`.
 *              Ahora incluye el `globalSetup` para limpieza de base de datos.
 * @author Raz Podestá
 * @version 1.1.0
 */
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar explícitamente las variables de entorno desde .env.local
dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  // --- INICIO DE CORRECCIÓN: GLOBAL SETUP ---
  globalSetup: "./tests/e2e/global-setup.ts", // Ruta al script de setup global
  // --- FIN DE CORRECCIÓN ---
  use: {
    baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
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
 * 1. **Activación de Limpieza E2E**: ((Implementada)) Se ha añadido la propiedad `globalSetup` en la configuración, vinculando el script de limpieza de la base de datos a la ejecución de las pruebas E2E.
 *
 * @subsection Melhorias Futuras
 * 1. **Setup por Proyecto**: ((Vigente)) Si se introducen múltiples "proyectos" de Playwright (ej. `api-tests`), cada uno podría tener su propio `globalSetup` para una limpieza más granular.
 *
 * =====================================================================
 */
