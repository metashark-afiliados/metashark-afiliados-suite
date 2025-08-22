// tests/config/vitest.setup.ts
/**
 * @file tests/config/vitest.setup.ts
 * @description Director de Orquesta de Pruebas de Élite. Refactorizado para
 *              delegar la carga de datos de i18n al aparato especializado
 *              `loadTestMessages`, mejorando la cohesión y el SRP.
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
import "@testing-library/jest-dom/vitest";
import "jest-axe/extend-expect";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { setupGlobalMocks } from "@tests/mocks";
import { server } from "@tests/mocks/server";
import { loadTestMessages } from "@tests/utils/i18n";
import { setCachedTestMessages } from "@tests/utils/render";

// --- Polyfills para Entorno JSDOM ---
if (typeof window !== "undefined") {
  const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  Element.prototype.scrollIntoView = vi.fn();
}

// --- Ciclo de Vida Global de la Suite de Pruebas ---
beforeAll(async () => {
  // 1. Inicia el servidor de mocks de red una vez.
  server.listen({ onUnhandledRequest: "error" });

  // 2. Orquesta la configuración de TODOS los mocks de módulo.
  setupGlobalMocks();

  // 3. Pre-carga y cachea los mensajes de i18n una vez.
  const messages = await loadTestMessages("es-ES");
  setCachedTestMessages(messages);
});

afterEach(() => {
  // Limpia el DOM y los contadores de mocks después de cada prueba.
  cleanup();
  vi.clearAllMocks();
  server.resetHandlers();
});

afterAll(() => {
  // Cierra el servidor de mocks al finalizar.
  server.close();
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cohesión Arquitectónica (SRP)**: ((Implementada)) ((Vigente)) El setup ahora se enfoca en la orquestación y delega la lógica de carga de datos, adhiriéndose estrictamente al Principio de Responsabilidad Única.
 * 2. **No Regresión**: ((Implementada)) La lógica y el comportamiento del ciclo de vida de las pruebas (`beforeAll`, `afterEach`, `afterAll`) se han mantenido intactos, garantizando que no haya regresiones funcionales.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga de Múltiples Locales**: ((Pendiente)) El `beforeAll` podría ser mejorado para cargar los mensajes de todos los locales soportados, lo que permitiría a las pruebas simular cambios de idioma y validar la internacionalización de forma más completa.
 *
 * =====================================================================
 */
// tests/config/vitest.setup.ts
