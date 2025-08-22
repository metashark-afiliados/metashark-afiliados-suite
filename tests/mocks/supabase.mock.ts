// tests/mocks/supabase.mock.ts
/**
 * @file tests/mocks/supabase.mock.ts
 * @description SSoT y ensamblador principal para la simulación (`vi.mock`) de los
 *              clientes Supabase. Esta factoría crea un objeto de mock de alta
 *              fidelidad que replica la API del cliente de Supabase y lo inyecta
 *              en los módulos de cliente de servidor y de navegador.
 *
 * @architecture
 *   - **Simulación Unificada**: Proporciona un único objeto `supabaseMock` para
 *     ambos clientes (`/server` y `/client`), garantizando un comportamiento
 *     consistente en todas las pruebas.
 *   - **Configurabilidad de ÉlITE**: La función `setupSupabaseMock` acepta un objeto
 *     de `overrides`, permitiendo a cada arnés de pruebas simular diferentes
 *     escenarios de autenticación (ej. usuario logueado vs. anónimo) con una
 *     sola línea de configuración.
 *   - **API Encadenable**: El mock de `.from()` devuelve `this`, permitiendo el
 *     encadenamiento de métodos (`supabase.from(...).select(...)`) tal como
 *     ocurre en el código de producción.
 *
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { type User } from "@supabase/supabase-js";
import { vi } from "vitest";

import * as DUMMY_DATA from "@tests/mocks/data/database-state";

/**
 * @public
 * @function setupSupabaseMock
 * @description Configura `vi.mock` para interceptar las importaciones de los
 *              clientes Supabase. Es consumida por el orquestador de mocks.
 * @param {object} [overrides] - Opciones para sobreescribir el estado de autenticación por defecto.
 * @param {User | null} [overrides.user] - El usuario a simular. `null` para un usuario no autenticado.
 */
export const setupSupabaseMock = (overrides: { user?: User | null } = {}) => {
  const user =
    overrides.user === undefined ? DUMMY_DATA.MOCKED_USER : overrides.user;
  const session = user ? { user } : null;

  const supabaseMock = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: [], error: null }),
    update: vi.fn().mockResolvedValue({ data: [], error: null }),
    delete: vi.fn().mockResolvedValue({ data: [], error: null }),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: {}, error: null }),
    rpc: vi.fn().mockResolvedValue({ data: {}, error: null }),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  };

  vi.mock("@/lib/supabase/server", () => ({
    createClient: () => supabaseMock,
    createAdminClient: () => supabaseMock,
  }));

  vi.mock("@/lib/supabase/client", () => ({
    createClient: () => supabaseMock,
  }));
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Aislamiento de la Capa de Datos**: ((Implementada)) Este aparato desacopla completamente los componentes y acciones de la base de datos real, permitiendo pruebas unitarias y de integración rápidas y predecibles.
 * 2. **Consolidación Arquitectónica**: ((Implementada)) Reemplaza múltiples archivos de mock de Supabase con un único aparato cohesivo y más simple.
 *
 * @subsection Melhorias Futuras
 * 1. **Mock de `storage`**: ((Vigente)) Si la aplicación implementa subida de archivos, se deberá extender `supabaseMock` para incluir una simulación de la API de `storage`.
 * 2. **Factoría de Query Builder de Alta Fidelidad**: ((Vigente)) Para pruebas de integración que necesiten validar mutaciones de datos, la implementación de `from` podría invocar una factoría más avanzada que opere sobre un estado en memoria.
 *
 * =====================================================================
 */
// tests/mocks/supabase.mock.ts
