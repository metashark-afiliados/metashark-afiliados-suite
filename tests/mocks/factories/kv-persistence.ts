// tests/mocks/factories/kv-persistence.ts
/**
 * @file kv-persistence.ts
 * @description Aparato atómico que encapsula la capa de persistencia para la
 *              base de datos simulada utilizando Vercel KV.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { kv } from "@vercel/kv";
import { logger } from "@/lib/logging";
import { db as INITIAL_DB_STATE } from "@tests/mocks/data/database-state";

const DB_KEY = "mock_db_state";
export type MockDbState = typeof INITIAL_DB_STATE;

/**
 * @public
 * @async
 * @function getDbState
 * @description Obtiene el estado actual de la DB simulada desde Vercel KV.
 *              Si no existe, la inicializa.
 * @returns {Promise<MockDbState>} El estado de la base de datos.
 */
export async function getDbState(): Promise<MockDbState> {
  let db = await kv.get<MockDbState>(DB_KEY);
  if (!db) {
    logger.warn(
      "[KV-Persistence] Inicializando estado de DB en Vercel KV por primera vez."
    );
    await kv.set(DB_KEY, INITIAL_DB_STATE);
    db = INITIAL_DB_STATE;
  }
  return db;
}

/**
 * @public
 * @async
 * @function updateDbState
 * @description Actualiza el estado completo de la DB simulada en Vercel KV.
 * @param {MockDbState} newState - El nuevo estado a persistir.
 */
export async function updateDbState(newState: MockDbState): Promise<void> {
  await kv.set(DB_KEY, newState);
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Aislamiento de Persistencia (SRP)**: ((Implementada)) Este aparato aísla completamente la lógica de Vercel KV, desacoplando la simulación de la base de datos de su mecanismo de almacenamiento.
 *
 * @subsection Melhorias Futuras
 * 1. **Estrategia de Persistencia Intercambiable**: ((Vigente)) Se podría crear una interfaz `IPersistenceStrategy` y hacer que este módulo la implemente. Esto permitiría cambiar fácilmente la capa de persistencia (ej. de Vercel KV a `localStorage` para pruebas locales) sin modificar el resto de los mocks.
 *
 * =====================================================================
 */
