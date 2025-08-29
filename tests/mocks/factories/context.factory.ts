// tests/mocks/factories/context.factory.ts
/**
 * @file context.factory.ts
 * @description Factoría de élite para la creación de mocks. Ha sido sincronizada
 *              con el contrato de datos `DashboardContextProps` para incluir la
 *              propiedad `workspaceMembers`, resolviendo el error de tipo TS2322
 *              y garantizando una simulación de alta fidelidad para el entorno de pruebas.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { faker } from "@faker-js/faker";
import { type User } from "@supabase/supabase-js";

import { type DashboardContextProps } from "@/lib/context/DashboardContext";
import { type FeatureModule } from "@/lib/data/modules";
import { type Enums, type Tables } from "@/lib/types/database";

import { DEV_USER, DEV_WORKSPACE } from "../data/database-state";

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

export function createMockProfile(
  overrides?: Partial<Tables<"profiles">>
): Tables<"profiles"> {
  const user = createMockUser({ id: overrides?.id });
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

export function createMockWorkspace(
  overrides?: Partial<Tables<"workspaces">>
): Tables<"workspaces"> {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    owner_id: faker.string.uuid(),
    icon: "🏢",
    current_site_count: faker.number.int({ min: 0, max: 10 }),
    created_at: faker.date.recent().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    ...overrides,
  };
}

export function createMockFeatureModule(
  overrides?: Partial<FeatureModule>
): FeatureModule {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.words({ min: 2, max: 4 }),
    description: faker.lorem.sentence(),
    tooltip: faker.lorem.sentence(),
    icon: "LayoutDashboard",
    href: `/dashboard/${faker.lorem.slug()}`,
    status: "active",
    required_plan: "free",
    display_order: faker.number.int({ min: 0, max: 100 }),
    ...overrides,
  };
}

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
    ],
    recentCampaigns: [],
    // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA (TS2322) ---
    workspaceMembers: [
      {
        id: faker.string.uuid(),
        workspace_id: activeWorkspace.id,
        user_id: user.id,
        role: "owner",
        created_at: new Date().toISOString(),
        profiles: profile,
      },
    ],
    activeSitesCount: 1,
    publishedCampaignsCount: 1,
    uniqueVisitors30d: 1234,
    aiCreditsRemaining: 500,
    maxSitesAllowed: 1,
    // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
    ...overrides,
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Futuras
 * 1. **Factorías Anidadas**: Para una simulación aún más realista, `createMockDashboardContext` podría invocar a `createMockWorkspaceMembers(count)` para poblar dinámicamente la lista de miembros.
 * 2. **Tipado de Overrides**: El tipo `Partial<DashboardContextProps>` es permisivo. Se podría utilizar un tipo más estricto (`DeepPartial`) para los `overrides` para mejorar la seguridad de tipos en las pruebas.
 * 3. **Consistencia de Datos**: El mock de `workspaceMembers` se crea estáticamente. Podría ser generado dinámicamente basándose en los `workspaces` y el `user` del contexto para una mayor consistencia interna del mock.
 * =====================================================================
 */
