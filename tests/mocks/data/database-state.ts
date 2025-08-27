// tests/mocks/data/database-state.ts
/**
 * @file database-state.ts
 * @description Manifiesto de Datos y SSoT para la DB simulada. Ha sido
 *              sincronizado con el schema.sql canónico para incluir la propiedad
 *              'icon' en la entidad 'workspaces', resolviendo el error de tipo TS2741.
 * @author Raz Podestá - MetaShark Tech
 * @version 7.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type Json, type Tables } from "@/lib/types/database";
import { type User } from "@supabase/supabase-js";

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
  icon: "🚀", // <-- SINCRONIZADO
  current_site_count: 1,
  created_at: new Date().toISOString(),
  updated_at: null,
};

const DEV_CREATION: Tables<"creations"> = {
  id: "creation-001",
  created_by: DEV_USER.id,
  workspace_id: DEV_WORKSPACE.id,
  name: "Landing Page V1",
  content: { theme: "dark" } as Json,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
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
  creations: [DEV_CREATION] as Tables<"creations">[],
  campaigns: [
    {
      id: "camp-001",
      creation_id: DEV_CREATION.id,
      site_id: "site-001",
      name: "Landing Page V1",
      slug: "landing-v1",
      status: "published",
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
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato de Mocks (TS2741)**: ((Implementada)) Se ha añadido la propiedad `icon: "🚀"` al objeto `DEV_WORKSPACE`. Esta corrección alinea el estado de la base de datos simulada con el contrato de tipo `Tables<"workspaces">`, resolviendo el error de compilación.
 *
 * @subsection Melhorias Futuras
 * 1. **Factorías Dinámicas**: ((Vigente)) Para pruebas más robustas, este estado estático podría ser generado por factorías que utilicen `faker.js`, como las que ya existen en `context.factory.ts`. Esto permitiría crear múltiples estados de prueba diferentes.
 *
 * =====================================================================
 */
// tests/mocks/data/database-state.ts
