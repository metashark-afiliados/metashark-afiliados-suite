// tests/mocks/factories/data.factory.ts
/**
 * @file tests/mocks/factories/data.factory.ts
 * @description Aparato atómico para la generación de datos de prueba dinámicos.
 *              Esta es la SSoT para crear instancias de entidades con `faker`.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { faker } from "@faker-js/faker";
import { type User } from "@supabase/supabase-js";

import { type CampaignMetadata } from "@/lib/data/campaigns";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { type Workspace } from "@/lib/data/workspaces";

export const createMockUser = (overrides: Partial<User> = {}): User =>
  ({
    id: faker.string.uuid(),
    email: faker.internet.email(),
    user_metadata: { full_name: faker.person.fullName() },
    app_metadata: { provider: "email", providers: ["email"], app_role: "user" },
    aud: "authenticated",
    created_at: faker.date.past().toISOString(),
    ...overrides,
  }) as User;

export const createMockWorkspace = (
  overrides: Partial<Workspace> = {}
): Workspace => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  owner_id: faker.string.uuid(),
  current_site_count: faker.number.int({ min: 0, max: 10 }),
  created_at: faker.date.past().toISOString(),
  updated_at: null,
  ...overrides,
});

// ... (Otras factorías de datos como createMockSite, etc.)
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Cohesión Arquitectónica**: ((Implementada)) Reubicado en `tests/mocks/factories/`.
 * =====================================================================
 */
// tests/mocks/factories/data.factory.ts
