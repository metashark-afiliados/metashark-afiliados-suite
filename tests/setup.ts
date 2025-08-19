// tests/setup.ts
/**
 * @file tests/setup.ts
 * @description Setup Global para Vitest v9.0. SSoT para mocks de alta fidelidad.
 *              Este archivo es el único punto de entrada para configurar el entorno
 *              de pruebas, delegando la creación de mocks a `tests/mocks.ts`.
 * @author Raz Podestá
 * @version 9.0.0
 */
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// --- Importación del Orquestador Global de Mocks ---
import { setupGlobalMocks } from "./mocks";

// Ejecutar el orquestador de mocks al inicio del setup global
setupGlobalMocks();

// --- CICLO DE VIDA DE PRUEBAS ---
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock for console logging (to prevent noise in tests, as it's not part of the Sentry mock)
// This is done globally via the `setupGlobalMocks` now.
