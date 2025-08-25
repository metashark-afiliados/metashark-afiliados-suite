/**
 * @file database-state.ts
 * @description Manifiesto de Datos y SSoT para la DB simulada.
 *              Ha sido refactorizado a un estándar de élite para reflejar
 *              la nueva arquitectura de "Creations", separando el contenido
 *              del metadato de la campaña y resolviendo errores de tipo.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
 * @date 2025-08-25
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
  current_site_count: 1,
  created_at: new Date().toISOString(),
  updated_at: null,
};

// --- INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA ---

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
      creation_id: DEV_CREATION.id, // Vinculado a la creación
      site_id: "site-001",
      name: "Landing Page V1",
      slug: "landing-v1",
      status: "published",
      affiliate_url: "https://aff.link/1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ] as Tables<"campaigns">[],
  // ... (resto de las tablas sin cambios)
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
// --- FIN DE REFACTORIZACIÓN ARQUITECTÓNICA ---

export const MOCKED_USER = DEV_USER;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación de Modelo de Datos (TS2352)**: ((Implementada)) El mock ahora refleja la nueva arquitectura de datos, separando `creations` de `campaigns` y resolviendo el error de tipo.
 * 2. **Integridad Referencial Simulada**: ((Implementada)) La campaña simulada ahora tiene una `creation_id` que la vincula a la creación simulada, manteniendo la coherencia del modelo.
 *
 * @subsection Melhorias Futuras
 * 1. **Factorías de Datos de Prueba**: ((Vigente)) Para pruebas más complejas, este estado estático podría ser reemplazado o complementado por factorías (ej. `createMockCampaign`) que permitan generar datos de prueba dinámicos.
 *
 * =====================================================================
 */
