// tests/e2e/auth.spec.ts
/**
 * @file auth.spec.ts
 * @description Arnés de pruebas E2E de élite para el ciclo de vida del usuario.
 *              Refactorizado para validar la Arquitectura v9.1 "Workspace Creativo".
 *              Valida el registro, el onboarding con el WelcomeModal sobre el dashboard,
 *              el cierre de sesión y el re-login.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { test, expect, type Page } from "@playwright/test";

// --- Factorías de Helpers de Interacción Atómicos ---

const generateUniqueUser = () => {
  const timestamp = Date.now();
  return {
    email: `e2e-user-${timestamp}@convertikit.dev`,
    password: `password-${timestamp}!`,
    // El nombre del workspace por defecto se genera automáticamente por el trigger de la BD.
    expectedWorkspaceName: `e2e-user-${timestamp}@convertikit.dev's Workspace`,
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

const performWelcomeModalInteraction = async (page: Page) => {
  // 1. Espera a ser redirigido al dashboard y que el modal aparezca.
  await page.waitForURL("**/dashboard**");
  const welcomeModalTitle = page.getByRole("heading", {
    name: /¡Bienvenido a ConvertiKit!/i,
  });
  await expect(welcomeModalTitle).toBeVisible();

  // 2. Interactúa con el modal.
  await page.getByRole("button", { name: /¡Vamos allá!/i }).click();

  // 3. Verifica que el modal se ha cerrado.
  await expect(welcomeModalTitle).not.toBeVisible();
};

const performLogout = async (page: Page) => {
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

test.describe("Flujo E2E v9.1: Ciclo de Vida del Usuario en Workspace Creativo", () => {
  const user = generateUniqueUser();

  test("debe registrar un usuario, mostrar el modal de bienvenida, y permitir el logout y login", async ({
    page,
  }) => {
    // === Fase 1: Registro y Onboarding ===
    await performSignUp(page, user);
    await performWelcomeModalInteraction(page);

    // === Fase 2: Verificación del Dashboard Post-Onboarding ===
    await expect(
      page.getByRole("heading", { name: /¿Qué vamos a convertir hoy/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: new RegExp(user.expectedWorkspaceName, "i"),
      })
    ).toBeVisible();

    // === Fase 3: Cierre de Sesión ===
    await performLogout(page);
    await expect(
      page.getByRole("link", { name: /iniciar sesión/i })
    ).toBeVisible();

    // === Fase 4: Re-Login ===
    await performLogin(page, user);

    // === Fase 5: Verificación Final del Dashboard ===
    await page.waitForURL("**/dashboard**");
    // Crítico: El modal de bienvenida NO debe aparecer en el segundo login.
    await expect(
      page.getByRole("heading", { name: /¡Bienvenido a ConvertiKit!/i })
    ).not.toBeVisible();
    await expect(
      page.getByRole("heading", { name: /¿Qué vamos a convertir hoy/i })
    ).toBeVisible();
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación con Arquitectura v9.1**: ((Implementada)) La suite de pruebas ahora valida el nuevo flujo de onboarding con el `WelcomeModal` sobre el dashboard, en lugar de la página `/welcome` obsoleta.
 * 2. **Validación de Persistencia de Onboarding**: ((Implementada)) Se ha añadido una verificación crítica para asegurar que el `WelcomeModal` no aparezca después del primer login, validando que la `completeOnboardingAction` funciona correctamente.
 * 3. **Helpers Atómicos Refactorizados**: ((Implementada)) Se ha creado el helper `performWelcomeModalInteraction` y se ha eliminado el obsoleto `performFirstWorkspaceCreation`, manteniendo el código de prueba limpio y legible.
 *
 * @subsection Melhorias Futuras
 * 1. **Limpieza de Datos de Prueba (Teardown)**: ((Vigente)) Implementar un hook `globalTeardown` para eliminar los usuarios de prueba de la base de datos después de la ejecución.
 * 2. **Page Object Model (POM)**: ((Vigente)) Abstraer las interacciones a clases de "Page Object" para una escalabilidad de élite.
 *
 * =====================================================================
 */
// tests/e2e/auth.spec.ts
