// tests/utils/factories.ts
/**
 * @file tests/utils/factories.ts
 * @description Manifiesto de Factorías de Pruebas de Élite.
 *              Ha sido nivelado para alinear la factoría `createMockSite` con el
 *              contrato de datos estricto de la tabla `sites`, resolviendo un
 *              error de compilación de TypeScript.
 * @author Raz Podestá
 * @version 3.3.0
 */
import { faker } from "@faker-js/faker";
import { type User } from "@supabase/supabase-js";
import { vi } from "vitest";

import { type SiteWithCampaignCount } from "@/lib/data/sites";

// --- Factorías de Datos de Prueba con Faker ---

/**
 * @public
 * @function createMockUser
 * @description Genera un objeto de usuario de Supabase simulado y realista.
 * @param {Partial<User>} [overrides] - Propiedades para sobrescribir los valores por defecto.
 * @returns {User} Un objeto de usuario de prueba completo.
 */
export const createMockUser = (overrides: Partial<User> = {}): User =>
  ({
    id: faker.string.uuid(),
    email: faker.internet.email(),
    user_metadata: { full_name: faker.person.fullName() },
    app_metadata: { provider: "email", providers: ["email"] },
    aud: "authenticated",
    created_at: faker.date.past().toISOString(),
    ...overrides,
  }) as User;

/**
 * @public
 * @function createMockSite
 * @description Genera un objeto de sitio de prueba realista.
 * @param {Partial<SiteWithCampaignCount>} [overrides] - Propiedades para sobrescribir.
 * @returns {SiteWithCampaignCount} Un objeto de sitio de prueba.
 */
export const createMockSite = (
  overrides: Partial<SiteWithCampaignCount> = {}
): SiteWithCampaignCount => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  subdomain: faker.lorem.slug(),
  description: faker.lorem.sentence(),
  icon: faker.internet.emoji(),
  created_at: faker.date.past().toISOString(),
  updated_at: null,
  workspace_id: faker.string.uuid(),
  owner_id: faker.string.uuid(),
  custom_domain: null,
  status: "draft", // <-- CORRECCIÓN: Se añade el valor por defecto requerido.
  campaign_count: faker.number.int({ min: 0, max: 20 }),
  ...overrides,
});

// --- Factorías de Mocks de Alta Fidelidad ---

export type MockSupabaseClient = {
  supabase: any;
  mocks: {
    mockFrom: ReturnType<typeof vi.fn>;
    mockSelect: ReturnType<typeof vi.fn>;
    mockInsert: ReturnType<typeof vi.fn>;
    mockUpdate: ReturnType<typeof vi.fn>;
    mockDelete: ReturnType<typeof vi.fn>;
    mockEq: ReturnType<typeof vi.fn>;
    mockIlike: ReturnType<typeof vi.fn>;
    mockOr: ReturnType<typeof vi.fn>;
    mockOrder: ReturnType<typeof vi.fn>;
    mockRange: ReturnType<typeof vi.fn>;
    mockSingle: ReturnType<typeof vi.fn>;
    mockRpc: ReturnType<typeof vi.fn>;
    mockLimit: ReturnType<typeof vi.fn>;
    mockGetUser: ReturnType<typeof vi.fn>;
    mockSignOut: ReturnType<typeof vi.fn>;
  };
};

/**
 * @public
 * @function createMockSupabaseClient
 * @description Crea un mock de alta fidelidad del cliente de Supabase.
 * @returns {MockSupabaseClient} Un objeto con la instancia simulada y los espías.
 */
export const createMockSupabaseClient = (): MockSupabaseClient => {
  const mocks = {
    mockSelect: vi.fn(),
    mockInsert: vi.fn(),
    mockUpdate: vi.fn(),
    mockDelete: vi.fn(),
    mockEq: vi.fn(),
    mockIlike: vi.fn(),
    mockOr: vi.fn(),
    mockOrder: vi.fn(),
    mockRange: vi.fn(),
    mockSingle: vi.fn(),
    mockRpc: vi.fn(),
    mockLimit: vi.fn(),
    mockGetUser: vi.fn(),
    mockSignOut: vi.fn(),
  };

  const queryBuilderMock = {
    select: mocks.mockSelect.mockReturnThis(),
    insert: mocks.mockInsert.mockReturnThis(),
    update: mocks.mockUpdate.mockReturnThis(),
    delete: mocks.mockDelete.mockReturnThis(),
    eq: mocks.mockEq.mockReturnThis(),
    ilike: mocks.mockIlike.mockReturnThis(),
    or: mocks.mockOr.mockReturnThis(),
    order: mocks.mockOrder.mockReturnThis(),
    range: mocks.mockRange.mockReturnThis(),
    limit: mocks.mockLimit.mockReturnThis(),
    single: mocks.mockSingle,
  };

  mocks.mockInsert.mockReturnValue(queryBuilderMock);
  mocks.mockUpdate.mockReturnValue(queryBuilderMock);
  mocks.mockDelete.mockReturnValue(queryBuilderMock);

  const mockFrom = vi.fn(() => queryBuilderMock);
  const supabase = {
    from: mockFrom,
    rpc: mocks.mockRpc,
    auth: {
      getUser: mocks.mockGetUser,
      signOut: mocks.mockSignOut,
    },
  };

  return {
    supabase,
    mocks: {
      ...mocks,
      mockFrom,
    },
  };
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato de Datos**: ((Implementada)) La factoría `createMockSite` ahora provee un valor por defecto para la propiedad `status`, alineando la generación de datos de prueba con el contrato estricto del esquema de la base de datos y resolviendo el error de compilación.
 *
 * @subsection Melhorias Futuras
 * 1. **Factorías Adicionales**: ((Vigente)) Crear factorías para otras entidades (`Campaign`, `Workspace`) para mantener el banco de mocks centralizado y robusto.
 *
 * =====================================================================
 */
// tests/utils/factories.ts
