// tests/e2e/global-setup.ts
/**
 * @file tests/e2e/global-setup.ts
 * @description Script de setup global de Playwright. Se ejecuta una vez
 *              antes de todas las pruebas para resetear la base de datos
 *              a un estado limpio y canónico utilizando una función RPC.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { chromium, type FullConfig } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Cargar las variables de entorno para acceder a las credenciales de Supabase.
// Es crucial que esto apunte a un archivo .env.test o .env.local con las credenciales
// del rol de servicio para la base de datos de pruebas.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env.local") }); // Asumiendo .env.local es la SSoT para envs locales

// Importar el cliente de Supabase de servidor.
// Se usa un import dinámico para asegurar que `server-only` no cause problemas.
const createAdminClient = async () => {
  const { createAdminClient: actualCreateAdminClient } = await import(
    "@/lib/supabase/server"
  );
  return actualCreateAdminClient();
};

/**
 * @public
 * @async
 * @function globalSetup
 * @description Resetea la base de datos de pruebas utilizando una función RPC.
 * @param {FullConfig} config - La configuración completa de Playwright.
 */
async function globalSetup(config: FullConfig) {
  console.log(`\n🧹 [E2E Global Setup] Iniciando limpieza de base de datos...`);

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error(
      "❌ [E2E Global Setup] ERROR: SUPABASE_SERVICE_ROLE_KEY no está definida. No se puede resetear la base de datos de pruebas."
    );
    process.exit(1);
  }

  try {
    const supabaseAdmin = await createAdminClient();
    const { data, error } = await supabaseAdmin.rpc("reset_for_tests");

    if (error) {
      throw new Error(
        `Fallo al ejecutar RPC 'reset_for_tests': ${error.message}`
      );
    }

    console.log(`✅ [E2E Global Setup] Base de datos de pruebas reseteada.`);
  } catch (error) {
    console.error(
      `🔥 [E2E Global Setup] Error crítico durante la limpieza:`,
      error
    );
    process.exit(1); // Abortar si el setup falla
  }

  // Opcional: Autenticar un usuario de prueba para todas las sesiones.
  // Esto puede ahorrar tiempo de login en cada prueba si muchas pruebas
  // asumen un usuario logueado.
  // const browser = await chromium.launch();
  // const page = await browser.newPage();
  // await page.goto('http://localhost:3000/auth/login');
  // await page.fill('#email', 'e2e-user@example.com');
  // await page.fill('#password', 'password123');
  // await page.click('button[type="submit"]');
  // await page.waitForURL('http://localhost:3000/dashboard');
  // await page.context().storageState({ path: 'storageState.json' });
  // await browser.close();
  // console.log('✅ [E2E Global Setup] Sesión de usuario de prueba guardada.');
}

export default globalSetup;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Limpieza de Datos Automatizada**: ((Implementada)) Se ha creado un `global-setup` para Playwright que llama a la función `reset_for_tests` en la base de datos. Esto asegura que cada ejecución E2E comience con un estado de datos predecible y limpio, eliminando los "flaky tests" causados por la contaminación de la base de datos.
 * 2. **Robustez y Observabilidad**: ((Implementada)) El script incluye un manejo robusto de errores y logs informativos para diagnosticar rápidamente cualquier fallo en el proceso de setup.
 *
 * @subsection Melhorias Futuras
 * 1. **Usuario de Prueba Compartido**: ((Vigente)) La lógica comentada para autenticar un usuario de prueba y guardar su estado de sesión podría ser activada para acelerar aún más las pruebas, evitando logins repetidos en cada `test`.
 * 2. **Configuración Dinámica de Roles**: ((Vigente)) El `globalSetup` podría aceptar parámetros para configurar roles específicos para usuarios de prueba, permitiendo probar escenarios de permisos con mayor flexibilidad.
 *
 * =====================================================================
 */
