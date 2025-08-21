// tests/config/vitest.setup.ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { server } from "@tests/mocks/msw";
import { setupGlobalMocks } from "@tests/mocks";

// --- INICIO DE BLINDAJE DE ENTORNO JSDOM DE ÉLITE ---
// Ciertas librerías de UI (como `cmdk` y `radix-ui`) dependen de APIs del
// navegador que no están completamente implementadas en JSDOM. Estos polyfills
// previenen errores de runtime y aseguran la estabilidad de las pruebas.
if (typeof window !== "undefined") {
  // Polyfill para `ResizeObserver`, requerido por componentes como Popover.
  const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);

  // Polyfill para `scrollIntoView`, requerido por `cmdk` (Command Menu).
  Element.prototype.scrollIntoView = vi.fn();
}
// --- FIN DE BLINDAJE DE ENTORNO JSDOM DE ÉLITE ---

// --- ORQUESTACIÓN DE MOCKS GLOBALES ---
setupGlobalMocks();

// --- GESTIÓN DEL CICLO DE VIDA DEL SERVIDOR DE MOCKS DE RED (MSW) ---
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// --- GARANTÍA DE AISLAMIENTO ENTRE PRUEBAS ---
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  server.resetHandlers();
  localStorage.clear(); // Limpieza de almacenamiento local
  sessionStorage.clear(); // Limpieza de almacenamiento de sesión
});

afterAll(() => server.close());

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Blindaje de JSDOM**: ((Implementada)) Se han añadido polyfills robustos para `ResizeObserver` y `scrollIntoView`, resolviendo la causa raíz de los fallos de renderizado en componentes que utilizan `cmdk` y Radix UI.
 * 2. **Aislamiento de Almacenamiento**: ((Implementada)) Se ha añadido `localStorage.clear()` y `sessionStorage.clear()` al `afterEach`, garantizando un entorno de prueba completamente limpio.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Timers**: ((Vigente)) Para pruebas que involucren `setTimeout` o `setInterval`, se podría añadir `vi.useRealTimers()` en `afterEach` para asegurar que los timers falsos (`fake timers`) no afecten a otras pruebas.
 *
 * =====================================================================
 */
// tests/config/vitest.setup.ts
