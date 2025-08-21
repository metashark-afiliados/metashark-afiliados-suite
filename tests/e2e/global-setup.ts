// tests/e2e/global-setup.ts
/**
 * @file tests/e2e/global-setup.ts
 * @description Script de setup global de Playwright. Nivelado para autenticar
 *              un usuario de prueba una vez y guardar su estado de sesión,
 *              optimizando drásticamente el rendimiento de la suite E2E.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { chromium, type FullConfig } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env.local") });

const createAdminClient = async () => {
  const { createAdminClient: actualCreateAdminClient } = await import(
    "@/lib/supabase/server"
  );
  return actualCreateAdminClient();
};

async function globalSetup(config: FullConfig) {
  console.log(`\n🧹 [E2E Global Setup] Iniciando limpieza de base de datos...`);
  // ... (Lógica de reseteo de DB sin cambios)
  try {
    const supabaseAdmin = await createAdminClient();
    await supabaseAdmin.rpc("reset_for_tests");
    console.log(`✅ [E2E Global Setup] Base de datos de pruebas reseteada.`);
  } catch (error) {
    console.error(
      `🔥 [E2E Global Setup] Error crítico durante la limpieza:`,
      error
    );
    process.exit(1);
  }

  // --- LÓGICA DE PERSISTENCIA DE SESIÓN DE ÉLITE ---
  console.log(`\n🔐 [E2E Global Setup] Autenticando usuario de prueba E2E...`);
  const { baseURL } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // PRERREQUISITO: El usuario 'e2e@convertikit.dev' debe existir en la DB de pruebas
  // tras el reseteo. La RPC `reset_for_tests` debe asegurar esto.
  const E2E_USER_EMAIL = process.env.E2E_USER_EMAIL || "e2e@convertikit.dev";
  const E2E_USER_PASSWORD = process.env.E2E_USER_PASSWORD || "password123";

  await page.goto(`${baseURL}/es-ES/auth/login`);
  await page.getByLabel(/correo electrónico/i).fill(E2E_USER_EMAIL);
  await page.getByLabel(/contraseña/i).fill(E2E_USER_PASSWORD);
  await page.getByRole("button", { name: /iniciar sesión/i }).click();
  await page.waitForURL(`**${baseURL}/es-ES/dashboard`);
  await page.context().storageState({ path: "./tests/e2e/storageState.json" });
  await browser.close();
  console.log(
    '✅ [E2E Global Setup] Sesión de usuario de prueba guardada en "storageState.json".'
  );
}

export default globalSetup;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Rendimiento E2E Optimizado**: ((Implementada)) La lógica de login y guardado de sesión está ahora activa. Las pruebas E2E ya no necesitarán iniciar sesión individualmente.
 *
 * =====================================================================
 */
// tests/e2e/global-setup.ts
