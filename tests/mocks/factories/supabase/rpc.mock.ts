// tests/mocks/factories/supabase/rpc.mock.ts
/**
 * @file tests/mocks/factories/supabase/rpc.mock.ts
 * @description Factoría atómica para simular las llamadas `rpc` de Supabase.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { vi } from "vitest";

export type SpiedRpcMocks = {
  mockRpc: ReturnType<typeof vi.fn>;
};

/**
 * @public
 * @function createRpcMock
 * @description Crea una función que simula `supabase.rpc`.
 * @param spies Los espías de Vitest para rastrear llamadas.
 * @returns Una función simulada de `supabase.rpc`.
 */
export const createRpcMock = (spies: SpiedRpcMocks) =>
  spies.mockRpc.mockResolvedValue({ data: {}, error: null });

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Aísla la simulación de llamadas a funciones RPC.
 * =====================================================================
 */
// tests/mocks/factories/supabase/rpc.mock.ts
