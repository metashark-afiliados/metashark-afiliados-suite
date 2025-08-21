// tests/setup.ts
/**
 * @file tests/setup.ts
 * @description Setup Global para Vitest v13.1.0 y SSoT para la configuración del
 *              entorno de pruebas. Orquesta la configuración del entorno en la
 *              secuencia correcta para garantizar un entorno de prueba hermético.
 * @author Raz Podestá
 * @version 13.1.0
 */
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// --- INICIO DE CORRECCIÓN ARQUITECTÓNICA CRÍTICA ---
// Se importa el orquestador desde la nueva SSoT de mocks atómicos.
// Esto desactiva el archivo monolítico `tests/mocks.ts` y activa la infraestructura de élite.
import { setupGlobalMocks } from "./mocks/index";
// --- FIN DE CORRECCIÓN ARQUITECTÓNICA CRÍTICA ---

// Se invoca inmediatamente para asegurar que todos los `vi.mock` se apliquen
// antes de que Vitest importe y ejecute los archivos de prueba.
setupGlobalMocks();

// Este hook se ejecuta después de CADA prueba (`it` block).
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución Definitiva del `ReferenceError`**: ((Implementada)) Al cambiar la ruta de importación a `./mocks/index`, este aparato activa la nueva arquitectura de mocks atómicos, donde la dependencia del contexto se resuelve correctamente.
 *
 * @subsection Melhorias Futuras
 * 1. **Reset de Estado de Mocks**: ((Vigente)) El `afterEach` podría ser extendido para invocar una función `resetAllStores()` que devuelva todos los stores de Zustand a su estado inicial.
 *
 * =====================================================================
 */
// tests/setup.ts
