// tests/mocks/factories/kv-persistence.ts
/**
 * @file tests/mocks/factories/kv-persistence.ts
 * @description Factoría de élite que simula un almacenamiento persistente de clave-valor
 *              (`Vercel KV`) en memoria para el entorno de pruebas. Esta es la
 *              Única Fuente de Verdad para el estado de la base de datos mockeada,
 *              permitiendo que las pruebas de integración manipulen y persistan
 *              datos simulados de forma consistente.
 * @author L.I.A. Legacy
 * @version 1.0.1
 */
import { afterEach, vi } from "vitest"; // <-- CORRECCIÓN: Importar afterEach
import { faker } from "@faker-js/faker"; // <-- CORRECCIÓN: Importar faker

import { db as INITIAL_DB_STATE } from "../data/database-state";
import { type Database } from "@/lib/types/database";

/**
 * @public
 * @typedef MockDbState
 * @description Define la estructura completa del estado de la base de datos simulada.
 *              Combina todos los tipos de tablas de nuestra `Database` generada.
 */
export type MockDbState = {
  [K in keyof Database["public"]["Tables"]]: Database["public"]["Tables"][K]["Row"][];
} & {
  // Añadir cualquier otra tabla/vista que esté en el mock pero no en `Tables`
};

let inMemoryDbState: MockDbState = JSON.parse(JSON.stringify(INITIAL_DB_STATE)); // Deep copy

/**
 * @public
 * @function getDbState
 * @description Devuelve el estado actual de la base de datos en memoria.
 * @returns {Promise<MockDbState>} Una promesa que resuelve con el estado actual de la base de datos mockeada.
 */
export async function getDbState(): Promise<MockDbState> {
  return inMemoryDbState;
}

/**
 * @public
 * @function updateDbState
 * @description Actualiza el estado de la base de datos en memoria.
 * @param {MockDbState} newState - El nuevo estado a aplicar.
 * @returns {Promise<void>}
 */
export async function updateDbState(newState: MockDbState): Promise<void> {
  inMemoryDbState = newState;
}

/**
 * @public
 * @function resetDbState
 * @description Restablece el estado de la base de datos en memoria a su valor inicial.
 * @returns {Promise<void>}
 */
export async function resetDbState(): Promise<void> {
  inMemoryDbState = JSON.parse(JSON.stringify(INITIAL_DB_STATE));
}

/**
 * @public
 * @function setupKvPersistenceMock
 * @description Configura el mock de `@vercel/kv` para usar nuestra persistencia en memoria.
 */
export const setupKvPersistenceMock = () => {
  vi.mock("@vercel/kv", () => ({
    kv: {
      get: vi.fn((key: string) => {
        return Promise.resolve(inMemoryDbState);
      }),
      set: vi.fn((key: string, value: any) => {
        inMemoryDbState = value;
        return Promise.resolve("OK");
      }),
      pipeline: vi.fn(() => ({
        incr: vi.fn().mockReturnThis(),
        expire: vi.fn().mockReturnThis(),
        exec: vi.fn(() => Promise.resolve(["OK", "OK"])),
      })),
    },
  }));
};

// Se restablece el estado de la DB en memoria después de cada test
afterEach(() => {
  // <-- CORRECCIÓN
  resetDbState();
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error `TS2339` (`afterEach` property)**: ((Implementada)) Se ha añadido la importación explícita de `afterEach` desde `vitest`, resolviendo el error de tipos y asegurando que la función de limpieza se ejecute correctamente.
 * 2. **Consistencia y No Regresión**: ((Implementada)) Todos los demás mocks y lógicas existentes se mantienen intactos.
 * 3. **Importación de `faker`**: ((Implementada)) Se ha añadido la importación de `faker` para evitar errores cuando se use en `mock-client-factory.ts`.
 *
 * @subsection Melhorias Futuras
 * 1. **Refinar `kv.get` y `kv.set`**: ((Vigente)) El mock de `kv.get` y `kv.set` actualmente opera con el estado completo. Para una fidelidad total con `Vercel KV`, podría ser mejorado para manejar claves individuales (ej. `kv.get("rate_limit_login_127.0.0.1")`).
 * 2. **Factoría para Escenarios de Datos**: ((Vigente)) En lugar de un `INITIAL_DB_STATE` estático, se podría crear una factoría `createInitialDbState(overrides?: Partial<MockDbState>)` que genere el estado inicial de la DB, permitiendo a las pruebas configurar la DB simulada para escenarios específicos.
 *
 * =====================================================================
 */
// tests/mocks/factories/kv-persistence.ts
