
// tests/mocks/data/database-state.ts
/**
 * @file tests/mocks/data/database-state.ts
 * @description Manifiesto de Datos de Prueba y SSoT para la DB simulada.
 *              Sincronizado para eliminar la propiedad `icon` de la entidad
 *              `workspaces`.
 * @author Raz Podestá
 * @version 2.1.0
 */
import { type User } from "@supabase/supabase-js";
import { type Json, type Tables } from "@/lib/types/database";

export const MOCKED_USER: User = {
  id: "dev-user-001",
  email: "dev@convertikit.com",
  user_metadata: {
    full_name: "Raz Podestá",
    avatar_url: "https://avatars.githubusercontent.com/u/1024025?v=4",
  },
  app_metadata: { provider: "email", providers: ["email"], app_role: "developer" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
};

export const db = {
  profiles: [
    {
      id: MOCKED_USER.id,
      email: MOCKED_USER.email!,
      full_name: MOCKED_USER.user_metadata?.full_name as string,
      avatar_url: MOCKED_USER.user_metadata?.avatar_url as string,
      app_role: "developer",
      plan_type: "enterprise",
      dashboard_layout: ["sites", "lia-chat"] as unknown as Json,
      has_completed_onboarding: true,
      created_at: new Date().toISOString(),
      updated_at: null,
    },
  ] as Tables<"profiles">[],
  workspaces: [
    {
      id: "dev-ws-001",
      name: "Development Workspace",
      owner_id: MOCKED_USER.id,
      current_site_count: 1,
      created_at: new Date().toISOString(),
      updated_at: null,
    },
  ] as Tables<"workspaces">[],
  workspace_members: [
    {
      id: "dev-wsm-001",
      workspace_id: "dev-ws-001",
      user_id: MOCKED_USER.id,
      role: "owner",
      created_at: new Date().toISOString(),
    },
  ] as Tables<"workspace_members">[],
  sites: [
    {
      id: "dev-site-001",
      workspace_id: "dev-ws-001",
      owner_id: MOCKED_USER.id,
      name: "Mi Primer Sitio",
      subdomain: "primer-sitio",
      custom_domain: null,
      description: "Un sitio de prueba para desarrollo.",
      icon: '🌐', // Este ícono es de la entidad 'sites', no 'workspaces'
      created_at: new Date().toISOString(),
      updated_at: null,
      status: "draft",
    },
  ] as Tables<"sites">[],
  feature_modules: [
    {
      id: "sites",
      title: "Mis Sitios",
      description: "Gestiona tus sitios y dominios.",
      tooltip: "Crear y administrar sitios.",
      icon_name: "Globe",
      href: "/dashboard/sites",
      status: "active",
      required_plan: "free",
      display_order: 1,
    },
    {
      id: "lia-chat",
      title: "L.I.A. Chat",
      description: "Tu asistente IA de marketing.",
      tooltip: "Chatea con L.I.A.",
      icon_name: "Sparkles",
      href: "/lia-chat",
      status: "active",
      required_plan: "free",
      display_order: 2,
    },
  ] as Tables<"feature_modules">[],
  campaigns: [] as Tables<"campaigns">[],
  invitations: [] as Tables<"invitations">[],
  visitor_logs: [] as Tables<"visitor_logs">[],
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Mocks**: ((Implementada)) Se ha eliminado la propiedad `icon` del objeto de workspace simulado, manteniendo los datos de prueba alineados con el esquema de la base de datos.
 *
 * @subsection Melhorias Futuras
 * 1. **Factorías de Mocks**: ((Vigente)) Abstraer la creación de datos a funciones factoría en `tests/utils/factories.ts` para mejorar la mantenibilidad.
 *
 * =====================================================================
 */
// tests/mocks/data/database-state.ts