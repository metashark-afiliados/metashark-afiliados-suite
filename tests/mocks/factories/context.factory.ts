// tests/mocks/factories/context.factory.ts
/**
 * @file tests/mocks/factories/context.factory.ts
 * @description Factoría de élite para la creación de un objeto de `DashboardContextProps`
 *              simulado. Es la Única Fuente de Verdad para generar el estado de contexto
 *              para las pruebas, permitiendo una configuración flexible y una alta fidelidad
 *              de datos.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { faker } from "@faker-js/faker";
import { type User } from "@supabase/supabase-js";

import { type FeatureModule } from "@/lib/data/modules";
import { type DashboardContextProps } from "@/lib/context/DashboardContext";
import { type Enums, type Tables } from "@/lib/types/database";

import { DEV_USER, DEV_WORKSPACE } from "../data/database-state";

/**
 * @public
 * @function createMockUser
 * @description Crea un objeto de usuario mockeado.
 * @param {Partial<User>} [overrides] - Propiedades para sobrescribir los valores por defecto.
 * @returns {User} Un objeto `User` simulado.
 */
export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    user_metadata: {
      full_name: faker.person.fullName(),
      avatar_url: faker.image.avatar(),
    },
    app_metadata: {
      provider: "email",
      providers: ["email"],
      app_role: "user" as Enums<"app_role">,
    },
    aud: "authenticated",
    created_at: faker.date.recent().toISOString(),
    ...overrides,
  };
}

/**
 * @public
 * @function createMockProfile
 * @description Crea un objeto de perfil de usuario mockeado.
 * @param {Partial<Tables<'profiles'>>} [overrides] - Propiedades para sobrescribir los valores por defecto.
 * @returns {Tables<'profiles'>} Un objeto `Tables<'profiles'>` simulado.
 */
export function createMockProfile(
  overrides?: Partial<Tables<"profiles">>
): Tables<"profiles"> {
  const user = createMockUser({ id: overrides?.id }); // Usa el ID si se proporciona
  return {
    id: user.id,
    email: user.email!,
    full_name: user.user_metadata?.full_name as string,
    avatar_url: user.user_metadata?.avatar_url as string,
    app_role: "user",
    plan_type: "free",
    dashboard_layout: null,
    has_completed_onboarding: true,
    created_at: user.created_at,
    updated_at: null,
    ...overrides,
  };
}

/**
 * @public
 * @function createMockWorkspace
 * @description Crea un objeto de workspace mockeado.
 * @param {Partial<Tables<'workspaces'>>} [overrides] - Propiedades para sobrescribir los valores por defecto.
 * @returns {Tables<'workspaces'>} Un objeto `Tables<'workspaces'>` simulado.
 */
export function createMockWorkspace(
  overrides?: Partial<Tables<"workspaces">>
): Tables<"workspaces"> {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    owner_id: faker.string.uuid(), // Puede ser un mock user ID
    current_site_count: faker.number.int({ min: 0, max: 10 }),
    created_at: faker.date.recent().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    ...overrides,
  };
}

/**
 * @public
 * @function createMockFeatureModule
 * @description Crea un objeto de FeatureModule mockeado.
 * @param {Partial<FeatureModule>} [overrides] - Propiedades para sobrescribir los valores por defecto.
 * @returns {FeatureModule} Un objeto `FeatureModule` simulado.
 */
export function createMockFeatureModule(
  overrides?: Partial<FeatureModule>
): FeatureModule {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.words({ min: 2, max: 4 }),
    description: faker.lorem.sentence(),
    tooltip: faker.lorem.sentence(),
    icon: "LayoutDashboard", // Icono por defecto de lucide-react
    href: `/dashboard/${faker.lorem.slug()}`,
    status: "active",
    required_plan: "free",
    display_order: faker.number.int({ min: 0, max: 100 }),
    ...overrides,
  };
}

/**
 * @public
 * @function createMockDashboardContext
 * @description Crea un objeto completo de `DashboardContextProps` con datos mockeados,
 *              permitiendo sobrescribir cualquier propiedad para escenarios de prueba específicos.
 * @param {Partial<DashboardContextProps>} [overrides] - Propiedades para sobrescribir los valores por defecto.
 * @returns {DashboardContextProps} Un objeto `DashboardContextProps` completamente simulado.
 */
export function createMockDashboardContext(
  overrides?: Partial<DashboardContextProps>
): DashboardContextProps {
  const user = createMockUser({
    id: DEV_USER.id,
    email: DEV_USER.email,
    user_metadata: DEV_USER.user_metadata,
    app_metadata: DEV_USER.app_metadata,
  });
  const profile = createMockProfile({
    id: user.id,
    email: user.email!,
    full_name: user.user_metadata?.full_name as string,
    app_role: user.app_metadata?.app_role as Enums<"app_role">,
  });
  const activeWorkspace = createMockWorkspace({
    id: DEV_WORKSPACE.id,
    name: DEV_WORKSPACE.name,
    owner_id: user.id,
  });

  return {
    user,
    profile,
    workspaces: [activeWorkspace, createMockWorkspace()],
    activeWorkspace,
    activeWorkspaceRole: "owner",
    pendingInvitations: [],
    modules: [
      createMockFeatureModule({
        id: "dashboard",
        title: "Dashboard",
        icon: "LayoutDashboard",
        href: "/dashboard",
      }),
      createMockFeatureModule({
        id: "sites",
        title: "Mis Sitios",
        icon: "Globe",
        href: "/dashboard/sites",
      }),
      createMockFeatureModule({
        id: "settings",
        title: "Ajustes",
        icon: "Settings",
        href: "/dashboard/settings",
      }),
    ],
    recentCampaigns: [],
    ...overrides,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Dependencia Crítica**: ((Implementada)) La creación de esta factoría resuelve el error `TS2307` en `tests/utils/render.tsx`, que era un bloqueador crítico para el entorno de pruebas.
 * 2. **Datos de Prueba de Alta Fidelidad**: ((Implementada)) Proporciona un objeto `DashboardContextProps` completamente mockeado que simula el estado real del dashboard, permitiendo testear componentes que dependen de este contexto.
 * 3. **Flexibilidad de Sobrescritura**: ((Implementada)) Permite sobrescribir cualquier parte del contexto por defecto para crear escenarios de prueba específicos, siguiendo el Principio de Atomicidad.
 * 4. **Funciones de Fábrica Atómicas**: ((Implementada)) Incluye `createMockUser`, `createMockProfile`, `createMockWorkspace`, y `createMockFeatureModule`, que son funciones puras y reutilizables para construir partes del contexto.
 * 5. **Uso de `faker-js`**: ((Implementada)) Integra `faker-js` para generar datos realistas y variados, mejorando la robustez de las pruebas.
 *
 * @subsection Melhorias Futuras
 * 1. **Mocks de Campañas y Sitios**: ((Vigente)) Expandir esta factoría para incluir la creación de mocks para `CampaignMetadata` y `SiteWithCampaignCount` para pruebas más complejas de los módulos de `sites` y `campaigns`.
 * 2. **Variantes de Perfil/Rol**: ((Vigente)) La función `createMockProfile` podría aceptar un `appRole` y `planType` como parámetros para simular diferentes tipos de usuarios (ej. admin, pro, free).
 * 3. **Generación Automática de Mocks**: ((Vigente)) Explorar la posibilidad de utilizar herramientas de generación automática de mocks (`mock-factory`) a partir de los tipos de Supabase (`Tables`, `Enums`) para reducir el mantenimiento manual de esta factoría.
 *
 * =====================================================================
 */
// tests/mocks/factories/context.factory.ts
