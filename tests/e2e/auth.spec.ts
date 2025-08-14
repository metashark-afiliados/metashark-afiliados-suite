// tests/e2e/auth.spec.ts
/**
 * @file auth.spec.ts
 * @description Arnés de pruebas E2E consolidado para el ciclo de vida del usuario.
 *              Valida el registro, onboarding, cierre de sesión e inicio de sesión.
 *              Utiliza factorías de helpers para máxima legibilidad y mantenibilidad.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { test, expect, type Page } from "@playwright/test";

// --- Factorías de Helpers de Interacción ---

const generateUniqueUser = () => {
  const timestamp = Date.now();
  return {
    email: `e2e-user-${timestamp}@convertikit.dev`,
    password: `password-${timestamp}!`,
    workspaceName: `Proyecto E2E ${timestamp}`,
  };
};

const performSignUp = async (
  page: Page,
  user: ReturnType<typeof generateUniqueUser>
) => {
  await page.goto("/auth/signup");
  await page.getByLabel(/correo electrónico/i).fill(user.email);
  await page.getByLabel(/contraseña/i).fill(user.password);
  await page.getByRole("button", { name: /crear cuenta/i }).click();
};

const performFirstWorkspaceCreation = async (
  page: Page,
  workspaceName: string
) => {
  await page.waitForURL("**/welcome**");
  await expect(
    page.getByRole("heading", { name: /¡Bienvenido a ConvertiKit!/i })
  ).toBeVisible();
  await page.getByLabel(/nombre del workspace/i).fill(workspaceName);
  await page.getByRole("button", { name: /crear workspace/i }).click();
};

const performLogout = async (page: Page) => {
  // Asume que el usuario está en el dashboard y el UserMenu es accesible
  await page.getByRole("button", { name: /raz podestá/i }).click();
  await page.getByRole("menuitem", { name: /cerrar sesión/i }).click();
  await page.waitForURL("**/");
};

const performLogin = async (
  page: Page,
  user: ReturnType<typeof generateUniqueUser>
) => {
  await page.goto("/auth/login");
  await page.getByLabel(/correo electrónico/i).fill(user.email);
  await page.getByLabel(/contraseña/i).fill(user.password);
  await page.getByRole("button", { name: /iniciar sesión/i }).click();
};

// --- Test Suite ---

test.describe("Flujo E2E de Ciclo de Vida del Usuario", () => {
  const user = generateUniqueUser();

  test("debe permitir a un nuevo usuario registrarse, crear un workspace, cerrar sesión y volver a iniciar sesión", async ({
    page,
  }) => {
    // 1. Registro
    await performSignUp(page, user);

    // 2. Onboarding: Creación del Primer Workspace
    await performFirstWorkspaceCreation(page, user.workspaceName);

    // 3. Verificación en el Dashboard
    await page.waitForURL("**/dashboard**");
    await expect(
      page.getByRole("heading", { name: /Bienvenido,/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: new RegExp(user.workspaceName, "i") })
    ).toBeVisible();

    // 4. Cierre de Sesión
    await performLogout(page);
    await expect(
      page.getByRole("link", { name: /iniciar sesión/i })
    ).toBeVisible();

    // 5. Inicio de Sesión
    await performLogin(page, user);

    // 6. Verificación Final en el Dashboard
    await page.waitForURL("**/dashboard**");
    await expect(
      page.getByRole("heading", { name: /Bienvenido,/i })
    ).toBeVisible();
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Principio DRY y Atomicidad**: ((Implementada)) La lógica de interacción se ha abstraído en helpers, haciendo el flujo de la prueba más legible y mantenible.
 * 2. **Cobertura de Ciclo de Vida Completo**: ((Implementada)) La prueba ahora valida el flujo completo desde el registro hasta el re-login, proporcionando una confianza de extremo a extremo mucho mayor.
 * 3. **Robustez de Selectores**: ((Implementada)) Se utilizan expresiones regulares insensibles a mayúsculas/minúsculas para que las pruebas sean más resistentes a cambios de texto.
 *
 * @subsection Melhorias Futuras
 * 1. **Limpieza de Datos de Prueba**: ((Vigente)) Implementar un hook `globalTeardown` en Playwright para eliminar los usuarios y workspaces de prueba de la base de datos después de la ejecución.
 * 2. **Page Object Model (POM)**: ((Vigente)) Para una escalabilidad de élite, abstraer las interacciones de página a clases de "Page Object", desacoplando aún más las pruebas de la estructura del DOM.
 *
 * =====================================================================
 */
// tests/e2e/auth.spec.ts
