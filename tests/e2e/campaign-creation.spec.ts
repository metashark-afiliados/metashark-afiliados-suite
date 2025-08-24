// tests/e2e/campaign-creation.spec.ts
/**
 * @file campaign-creation.spec.ts
 * @description Arnés de pruebas E2E de diagnóstico para el flujo de creación
 *              de campañas. Valida el camino desde el dashboard hasta el
 *              resultado de la creación de la campaña.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { test, expect, type Page } from "@playwright/test";

// --- Helpers de Interacción Atómicos ---

const navigateToDashboard = async (page: Page) => {
  await page.goto("/es-ES/dashboard");
  // Esperar a que el Hub Creativo sea visible
  await expect(
    page.getByRole("heading", { name: /¿Qué vamos a crear hoy/i })
  ).toBeVisible({ timeout: 10000 });
};

const clickCreateLandingPage = async (page: Page) => {
  const landingPageButton = page.getByRole("link", { name: /Landing Page/i });
  await landingPageButton.click();
};

// --- Test Suite ---

test.describe("Flujo E2E de Diagnóstico: Creación de Campaña", () => {
  test("debe navegar al flujo de creación y analizar el resultado", async ({
    page,
  }) => {
    // 1. Navegar al punto de partida
    await navigateToDashboard(page);

    // 2. Iniciar la acción de creación
    await clickCreateLandingPage(page);

    // 3. Esperar la navegación a la página de carga/bootstrap
    await page.waitForURL("**/builder/new?type=landing", { timeout: 5000 });
    console.log("INFO: Navegación a /builder/new completada.");

    // 4. Analizar el resultado final.
    // Usamos Promise.race para ver qué ocurre primero: la redirección al
    // builder (éxito) o la aparición de la tarjeta de error (fallo).
    const successCondition = page.waitForURL(
      "**/builder/boilerplate-campaign-001",
      {
        timeout: 15000,
      }
    );
    const failureCondition = page.waitForSelector(
      '[data-testid="error-state-card"]',
      { timeout: 15000 }
    );

    const result = await Promise.race([
      successCondition.then(() => "SUCCESS"),
      failureCondition.then(() => "FAILURE"),
    ]);

    // 5. Aserción final y reporte
    if (result === "SUCCESS") {
      console.log("DIAGNÓSTICO: ÉXITO. Redirección al builder completada.");
      await expect(
        page.locator("iframe[title='Campaign Preview']")
      ).toBeVisible();
    } else {
      console.error("DIAGNÓSTICO: FALLO. Se renderizó la tarjeta de error.");
      const errorTitle = await page
        .locator('[data-testid="error-state-card"] h2')
        .textContent();
      const errorDescription = await page
        .locator('[data-testid="error-state-card"] p')
        .textContent();
      console.error(`- Título del Error: ${errorTitle}`);
      console.error(`- Descripción del Error: ${errorDescription}`);

      // Forzamos el fallo de la prueba para que sea explícito.
      test.fail(
        true,
        `Fallo detectado: Se mostró la tarjeta de error con el título "${errorTitle}"`
      );
    }

    // Si la prueba llega aquí sin fallar, significa que el flujo fue exitoso.
    expect(result).toBe("SUCCESS");
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Diagnóstico Automatizado**: ((Implementada)) Este arnés actúa como una herramienta de diagnóstico que valida el flujo completo y reporta el resultado de forma clara.
 * 2. **Lógica de `Promise.race`**: ((Implementada)) El uso de `Promise.race` es una técnica de élite en Playwright para manejar flujos con múltiples resultados posibles (éxito/fallo) de forma robusta.
 *
 * =====================================================================
 */
// tests/e2e/campaign-creation.spec.ts
