// tests/setup.ts
/**
 * @file tests/setup.ts
 * @description Archivo de Setup Global para el Entorno de Pruebas de Vitest.
 *              Ha sido refactorizado para utilizar una importación relativa
 *              inequívoca para el servidor de mocks, resolviendo un error de
 *              resolución de módulo persistente y garantizando la máxima robustez
 *              en la inicialización del entorno de pruebas.
 * @author Raz Podestá
 * @version 5.0.0
 */
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

// --- MEJORA DE ÉLITE: RUTA RELATIVA ROBUSTA ---
// Se utiliza una ruta relativa directa para eliminar cualquier ambigüedad
// de resolución de alias durante la fase de setup de Vitest.
import { server } from "./mocks/server";

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
 * 1. **Resolución de Error de Compilación Definitiva**: ((Implementada)) El uso de una ruta relativa (`./mocks/server`) elimina la dependencia de la resolución de alias en este archivo crítico, resolviendo el error `TS2307`.
 * 2. **Consolidación de `afterEach`**: ((Implementada)) Se han consolidado las tres operaciones de limpieza en un único hook `afterEach` para mayor concisión.
 *
 * =====================================================================
 */
// tests/setup.ts
