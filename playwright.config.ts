// playwright.config.ts
/**
 * @file playwright.config.ts
 * @description Configuración canónica para la suite de pruebas E2E con Playwright.
 *              Alineada con la estrategia de entorno único, utiliza `.env.local`
 *              como la SSoT para las pruebas locales y el comando `pnpm dev`.
 * @author Raz Podestá
 * @version 1.0.0
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
 * 1. **Estrategia de Entorno Único**: ((Implementada)) La configuración carga `.env.local` y utiliza `pnpm dev`, simplificando la configuración y eliminando dependencias de scripts obsoletos.
 * 2. **Rutas Robustas**: ((Implementada)) Utiliza `path.resolve` para una resolución de ruta de archivo de entorno a prueba de fallos.
 *
 * @subsection Melhorias Futuras
 * 1. **Setup Global de Pruebas E2E**: ((Vigente)) Se puede configurar un `globalSetup` que ejecute una RPC para resetear la base de datos de pruebas antes de iniciar la suite, garantizando un estado limpio para cada ejecución.
 *
 * =====================================================================
 */
// playwright.config.ts
