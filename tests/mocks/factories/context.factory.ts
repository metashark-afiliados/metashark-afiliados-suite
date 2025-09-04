// tests/mocks/factories/context.factory.ts
/**
 * @file context.factory.ts
 * @description Factoría de élite para la creación de mocks. Sincronizada con la
 *              arquitectura "Lean Database", utilizando `role_id` y `status_id`
 *              para una simulación de alta fidelidad.
 * @author L.I.A. Legacy
 * @version 5.0.0
 */
import { faker } from "@faker-js/faker";
import { type User } from "@supabase/supabase-js";

import { WORKSPACE_ROLES } from "@/config/roles.config";
import { type DashboardContextProps } from "@/lib/context/DashboardContext";
import { type FeatureModule } from "@/lib/data/modules";
import { type Tables } from "@/lib/types/database";
import { DEV_USER, DEV_WORKSPACE } from "../data/database-state";

export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    user_metadata: {
      full_name: faker.person.fullName(),
      avatar_url: faker.image.avatar(),
    },
    app_metadata: { provider: "email", providers: ["email"], app_role: "user" },
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
    current_site_count: 0, // <-- REFACTORIZACIÓN: Añadido valor por defecto
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
    app_role: user.app_metadata?.app_role as "user" | "admin" | "developer",
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
    // --- INICIO DE REFACTORIZACIÓN: Alineación con Lean Database ---
    activeWorkspaceRoleId: WORKSPACE_ROLES.OWNER.id,
    // --- FIN DE REFACTORIZACIÓN ---
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
    workspaceMembers: [
      {
        id: faker.string.uuid(),
        workspace_id: activeWorkspace.id,
        user_id: user.id,
        // --- INICIO DE REFACTORIZACIÓN: Alineación con Lean Database ---
        role_id: WORKSPACE_ROLES.OWNER.id,
        created_at: new Date().toISOString(),
        profiles: profile,
        workspace_roles: { name: WORKSPACE_ROLES.OWNER.name }, // Simula el JOIN
        // --- FIN DE REFACTORIZACIÓN ---
      },
    ],
    activeSitesCount: 1,
    publishedCampaignsCount: 1,
    uniqueVisitors30d: 1234,
    aiCreditsRemaining: 500,
    maxSitesAllowed: 1,
    ...overrides,
  };
}
// tests/mocks/factories/context.factory.ts
