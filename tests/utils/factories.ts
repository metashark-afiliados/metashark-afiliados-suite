// tests/utils/factories.ts
/**
 * @file tests/utils/factories.ts
 * @description Manifiesto de Factorías de Pruebas de Élite.
 *              Ha sido nivelado para integrar `@faker-js/faker`, generando datos
 *              de prueba realistas y dinámicos que mejoran la robustez y
 *              fidelidad de las pruebas. Es la SSoT para la creación de datos
 *              y mocks consistentes.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { faker } from "@faker-js/faker";
import { type User } from "@supabase/supabase-js";
import { vi } from "vitest";

import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { type Tables } from "@/lib/types/database";

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
    mockEq: ReturnType<typeof vi.fn>;
    mockIlike: ReturnType<typeof vi.fn>;
    mockOr: ReturnType<typeof vi.fn>;
    mockOrder: ReturnType<typeof vi.fn>;
    mockRange: ReturnType<typeof vi.fn>;
    mockSingle: ReturnType<typeof vi.fn>;
    mockRpc: ReturnType<typeof vi.fn>;
    mockLimit: ReturnType<typeof vi.fn>;
  };
};

/**
 * @public
 * @function createMockSupabaseClient
 * @description Crea un mock de alta fidelidad del cliente de Supabase.
 * @returns {MockSupabaseClient} Un objeto con la instancia simulada y los espías.
 */
export const createMockSupabaseClient = (): MockSupabaseClient => {
  const mockSingle = vi.fn();
  const mockRange = vi.fn();
  const mockInsert = vi.fn();
  const mockRpc = vi.fn();
  const mockOr = vi.fn();
  const mockIlike = vi.fn();
  const mockOrder = vi.fn();
  const mockSelect = vi.fn();
  const mockEq = vi.fn();
  const mockLimit = vi.fn();

  const queryBuilderMock = {
    select: mockSelect.mockReturnThis(),
    insert: mockInsert,
    eq: mockEq.mockReturnThis(),
    ilike: mockIlike.mockReturnThis(),
    or: mockOr.mockReturnThis(),
    order: mockOrder.mockReturnThis(),
    single: mockSingle,
    range: mockRange,
    limit: mockLimit.mockReturnThis(),
  };

  const mockFrom = vi.fn(() => queryBuilderMock);
  const supabase = { from: mockFrom, rpc: mockRpc };

  mockOrder.mockReturnValue(queryBuilderMock);

  return {
    supabase,
    mocks: {
      mockFrom,
      mockSelect,
      mockInsert,
      mockEq,
      mockIlike,
      mockOr,
      mockOrder,
      mockRange,
      mockSingle,
      mockRpc,
      mockLimit,
    },
  };
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Datos de Prueba Realistas**: ((Implementada)) La integración con `@faker-js/faker` asegura que las pruebas se ejecuten con datos variados y más parecidos a los de producción, aumentando la probabilidad de descubrir casos borde.
 *
 * @subsection Melhorias Futuras
 * 1. **Seed Consistente**: ((Vigente)) Se puede usar `faker.seed()` al inicio de una suite de pruebas para que la data generada sea la misma en cada ejecución, haciendo las pruebas 100% deterministas.
 *
 * =====================================================================
 */
// tests/utils/factories.ts
