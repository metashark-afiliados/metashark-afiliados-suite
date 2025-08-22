// tests/mocks/data/database-state.ts
/**
 * @file database-state.ts
 * @description Manifiesto de Datos y SSoT para la DB simulada.
 *              Sincronizado para reflejar la estructura cruda de la base de
 *              datos (`icon_name`), actuando como una fuente de verdad de alta fidelidad.
 * @author L.I.A. Legacy
 * @version 5.0.0
 */
import { type User } from "@supabase/supabase-js";
import { type Json, type Tables } from "@/lib/types/database";

export const DEV_USER: User = {
  id: "dev-user-001",
  email: "dev@convertikit.com",
  user_metadata: { full_name: "Raz Podestá" },
  app_metadata: {
    provider: "email",
    providers: ["email"],
    app_role: "developer",
  },
  aud: "authenticated",
  created_at: new Date().toISOString(),
};

export const DEV_WORKSPACE: Tables<"workspaces"> = {
  id: "dev-ws-001",
  name: "Development Workspace",
  owner_id: DEV_USER.id,
  current_site_count: 1,
  created_at: new Date().toISOString(),
  updated_at: null,
};

export const db = {
  profiles: [
    {
      id: DEV_USER.id,
      email: DEV_USER.email!,
      full_name: DEV_USER.user_metadata?.full_name as string,
      avatar_url: "",
      app_role: "developer",
      plan_type: "enterprise",
      has_completed_onboarding: true,
      dashboard_layout: null,
      created_at: new Date().toISOString(),
      updated_at: null,
    },
  ] as Tables<"profiles">[],
  workspaces: [DEV_WORKSPACE] as Tables<"workspaces">[],
  workspace_members: [
    {
      id: "wsm-001",
      workspace_id: DEV_WORKSPACE.id,
      user_id: DEV_USER.id,
      role: "owner",
      created_at: new Date().toISOString(),
    },
  ] as Tables<"workspace_members">[],
  sites: [
    {
      id: "site-001",
      workspace_id: DEV_WORKSPACE.id,
      owner_id: DEV_USER.id,
      name: "Project Phoenix",
      subdomain: "phoenix",
      custom_domain: null,
      icon: "🔥",
      description: "Main dev site",
      status: "published",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ] as Tables<"sites">[],
  campaigns: [
    {
      id: "camp-001",
      site_id: "site-001",
      name: "Landing Page V1",
      slug: "landing-v1",
      status: "published",
      content: { theme: "dark" } as Json,
      affiliate_url: "https://aff.link/1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ] as Tables<"campaigns">[],
  invitations: [] as Tables<"invitations">[],
  visitor_logs: [] as Tables<"visitor_logs">[],
  feature_modules: [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "Main dashboard overview",
      tooltip: null,
      icon_name: "LayoutDashboard",
      href: "/dashboard",
      status: "active",
      required_plan: "free",
      display_order: 0,
    },
  ] as Tables<"feature_modules">[],
};

export const MOCKED_USER = DEV_USER;
// tests/mocks/data/database-state.ts
