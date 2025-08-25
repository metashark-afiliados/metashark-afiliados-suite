// tests/e2e/landing-page.spec.ts
/**
 * @file landing-page.spec.ts
 * @description Arnés de pruebas E2E de élite para la Landing Page.
 *              Corregido para utilizar la API `request.postData()` de Playwright
 *              para la inspección del cuerpo de la petición, resolviendo el
 *              error de tipo `TS2339`.
 * @author L.I.A. Legacy
 * @version 1.0.1
 */
import { test, expect, type Page } from "@playwright/test";

// --- Helpers de Interacción Atómicos ---

const checkHeroSectionVisibility = async (page: Page) => {
  await expect(
    page.getByRole("heading", {
      name: /Crea Campañas de Afiliados de Alto Rendimiento con IA/i,
    })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Empezar Ahora/i })
  ).toBeVisible();
};

const performNewsletterSubscription = async (page: Page) => {
  await page.route("**/", async (route) => {
    const request = route.request();
    // --- INICIO DE CORRECCIÓN DE API ---
    const postData = request.postData();
    if (
      request.method() === "POST" &&
      postData &&
      postData.includes("subscribeToNewsletterAction")
    ) {
      // Parsear los datos del formulario desde el cuerpo de la petición
      const formData = new URLSearchParams(postData);
      expect(formData.get("$$actionId")).toContain(
        "subscribeToNewsletterAction"
      );

      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { messageKey: "Newsletter.success_new" },
        }),
      });
    }
    // --- FIN DE CORRECCIÓN DE API ---
    return route.continue();
  });

  const email = `e2e-subscriber-${Date.now()}@example.com`;
  const emailInput = page
    .getByPlaceholder(/Introduce tu correo electrónico/i)
    .first();
  const submitButton = page.getByRole("button", { name: /Suscribirse/i });

  await emailInput.fill(email);
  await submitButton.click();
};

const checkToastVisibility = async (page: Page) => {
  await expect(page.getByRole("status")).toHaveText(
    /¡Gracias por suscribirte!/i
  );
};

const navigateToSignUp = async (page: Page) => {
  await page.getByRole("link", { name: /Registrarse Gratis/i }).click();
  await page.waitForURL("**/signup");
  await expect(
    page.getByRole("heading", { name: /Crea tu Cuenta/i })
  ).toBeVisible();
};

// --- Test Suite ---

test.describe("Flujo E2E: Landing Page para Visitantes Anónimos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/es-ES");
  });

  test("debe renderizar la sección Hero y permitir la navegación a la página de registro", async ({
    page,
  }) => {
    await checkHeroSectionVisibility(page);
    await navigateToSignUp(page);
  });

  test("debe permitir a un usuario suscribirse a la newsletter y mostrar un toast de éxito", async ({
    page,
  }) => {
    await performNewsletterSubscription(page);
    await checkToastVisibility(page);
  });
});
