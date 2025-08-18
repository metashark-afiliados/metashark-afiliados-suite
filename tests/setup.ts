// tests/setup.ts
/**
 * @file tests/setup.ts
 * @description Archivo de Setup Global para el Entorno de Pruebas de Vitest.
 *              Ha sido nivelado a un estándar de élite para incluir un mock
 *              global para las APIs del servidor de React (como `cache`),
 *              resolviendo errores de `TypeError` en toda la suite de pruebas.
 * @author Raz Podestá
 * @version 6.0.0
 */
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { server } from "./mocks/server";

// --- MEJORA DE ÉLITE: MOCK GLOBAL PARA APIS DE REACT SERVER ---
// Se simula la API `cache` de React para todo el entorno de pruebas de Vitest.
// Esto previene errores `TypeError` en cualquier prueba que importe, directa o
// indirectamente, módulos que usan APIs de React Server.
vi.mock("react", async (importOriginal) => {
  const mod = await importOriginal<typeof import("react")>();
  return {
    ...mod,
    cache: (fn: any) => fn, // Simulado como una función de identidad.
  };
});

// Iniciar el servidor de mocks ANTES de que se ejecuten todas las pruebas.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  server.resetHandlers();
});

// Cerrar el servidor de mocks DESPUÉS de que todas las pruebas hayan terminado.
afterAll(() => server.close());

vi.mock("server-only", () => {
  return {};
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Estabilidad del Entorno de Pruebas**: ((Implementada)) La adición del mock global para `React.cache` resuelve un error sistémico, garantizando que todas las pruebas se ejecuten en un entorno que tolera las APIs del servidor de React.
 * 2. **Principio DRY**: ((Implementada)) Centraliza la lógica del mock en un solo lugar, eliminando la necesidad de repetirlo en cada archivo de prueba.
 *
 * @subsection Melhorias Futuras
 * 1. **Mocks de Runtime Adicionales**: ((Vigente)) Este es el lugar canónico para añadir mocks para otras futuras APIs de React Server (ej. `use`) si fuera necesario.
 *
 * =====================================================================
 */
// tests/setup.ts
