// tests/utils/factories/data.factory.ts
/**
 * @file tests/utils/factories/data.factory.ts
 * @description Aparato atómico para la generación de datos de prueba dinámicos.
 *              Esta es la SSoT para crear instancias de entidades con datos
 *              falsos (`faker`) para poblar el estado de las pruebas, garantizando
 *              consistencia y realismo.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { faker } from "@faker-js/faker";
import { type User } from "@supabase/supabase-js";

import { type CampaignMetadata } from "@/lib/data/campaigns";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { type Workspace } from "@/lib/data/workspaces";

/**
 * @public
 * @function createMockUser
 * @description Crea un objeto de usuario simulado con datos dinámicos.
 * @param {Partial<User>} [overrides] - Propiedades para sobrescribir los valores por defecto.
 * @returns {User} Un objeto de usuario simulado.
 */
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

/**
 * @public
 * @function createMockWorkspace
 * @description Crea un objeto de workspace simulado con datos dinámicos.
 * @param {Partial<Workspace>} [overrides] - Propiedades para sobrescribir los valores por defecto.
 * @returns {Workspace} Un objeto de workspace simulado.
 */
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

/**
 * @public
 * @function createMockSite
 * @description Crea un objeto de sitio simulado con datos dinámicos.
 * @param {Partial<SiteWithCampaignCount>} [overrides] - Propiedades para sobrescribir los valores por defecto.
 * @returns {SiteWithCampaignCount} Un objeto de sitio simulado.
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
  status: "draft",
  campaign_count: faker.number.int({ min: 0, max: 20 }),
  ...overrides,
});

/**
 * @public
 * @function createMockCampaign
 * @description Crea un objeto de metadatos de campaña simulado con datos dinámicos.
 * @param {Partial<CampaignMetadata>} [overrides] - Propiedades para sobrescribir los valores por defecto.
 * @returns {CampaignMetadata} Un objeto de metadatos de campaña simulado.
 */
export const createMockCampaign = (
  overrides: Partial<CampaignMetadata> = {}
): CampaignMetadata => ({
  id: faker.string.uuid(),
  site_id: faker.string.uuid(),
  name: faker.commerce.productName(),
  slug: faker.lorem.slug(),
  status: "draft",
  created_at: faker.date.past().toISOString(),
  updated_at: null,
  affiliate_url: null,
  ...overrides,
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Fundación de Pruebas**: ((Implementada)) Este aparato establece la SSoT para la generación de datos de prueba, un pilar esencial para la fiabilidad de toda la suite de pruebas.
 * 2. **Datos Dinámicos**: ((Implementada)) El uso de `faker` asegura que cada ejecución de prueba opere con un conjunto de datos único, previniendo falsos positivos causados por datos cacheados o codificados en duro.
 * 3. **Atomicidad y Cohesión**: ((Implementada)) Cada factoría tiene la responsabilidad única de crear un tipo de entidad, adhiriéndose a la "Filosofía LEGO".
 *
 * @subsection Melhorias Futuras
 * 1. **Factorías Relacionales**: ((Vigente)) Las factorías podrían ser mejoradas para aceptar IDs de entidades relacionadas (ej. `createMockSite({ workspaceId: '...' })`), facilitando la construcción de estados de prueba complejos y relacionalmente consistentes.
 * 2. **Generación desde Tipos/Zod**: ((Vigente)) Investigar el uso de librerías como `zod-fixture` para generar automáticamente datos de prueba a partir de los schemas de Zod, garantizando una sincronización perpetua entre los datos de prueba y los contratos de datos de la aplicación.
 *
 * =====================================================================
 */
// tests/utils/factories/data.factory.ts
