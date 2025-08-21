// tests/config/vitest.setup.ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { server } from "@tests/mocks/msw";
import { setupGlobalMocks } from "@tests/mocks";

// --- INICIO DE BLINDAJE DE ENTORNO JSDOM DE ÉLITE v2.0 ---
if (typeof window !== "undefined") {
  // Polyfill para `ResizeObserver`, requerido por componentes como Popover.
  const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);

  // Polyfill para `scrollIntoView`, requerido por `cmdk`.
  Element.prototype.scrollIntoView = vi.fn();

  // Polyfill para Pointer Events, requerido por Radix UI v1.1.0+
  // Esto resuelve el error "target.hasPointerCapture is not a function".
  if (!window.PointerEvent) {
    class PointerEvent extends Event {}
    vi.stubGlobal("PointerEvent", PointerEvent);
  }
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = vi.fn();
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = vi.fn();
  }
}
// --- FIN DE BLINDAJE DE ENTORNO JSDOM DE ÉLITE v2.0 ---

setupGlobalMocks();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  server.resetHandlers();
  localStorage.clear();
  sessionStorage.clear();
});

afterAll(() => server.close());

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Estabilidad de Radix UI**: ((Implementada)) Se ha añadido un polyfill para `PointerEvent` y sus métodos asociados, resolviendo la causa raíz de los fallos en pruebas de componentes que usan Radix UI.
 *
 * =====================================================================
 */
