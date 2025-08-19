// tests/mocks/data/database-state.ts
/**
 * @file tests/mocks/data/database-state.ts
 * @description Manifiesto de Datos de Prueba y SSoT para la DB simulada.
 *              Sincronizado para eliminar la propiedad `icon` de la entidad
 *              `workspaces`. Ahora, los `feature_modules` se alinean con la
 *              interfaz `FeatureModule` para resolver errores de tipo.
 *              Sincronizado para incluir `required_plan`.
 * @author Raz Podestá
 * @version 2.2.2
 */
import { type User } from "@supabase/supabase-js";
import { type Json, type Tables } from "@/lib/types/database";
import { type FeatureModule } from "@/lib/data/modules"; // Importar la interfaz FeatureModule
import { type Enums } from "@/lib/types/database/enums"; // Import Enums type

export const MOCKED_USER: User = {
  id: "dev-user-001",
  email: "dev@convertikit.com",
  user_metadata: {
    full_name: "Raz Podestá",
    avatar_url: "https://avatars.githubusercontent.com/u/1024025?v=4",
  },
  app_metadata: {
    provider: "email",
    providers: ["email"],
    app_role: "developer",
  },
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
      icon: "🌐", // Este ícono es de la entidad 'sites', no 'workspaces'
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
      icon: "Globe",
      href: "/dashboard/sites",
      status: "active",
      required_plan: "free" as Enums["plan_type"], // Cast to required enum type
      display_order: 1,
    },
    {
      id: "lia-chat",
      title: "L.I.A. Chat",
      description: "Tu asistente IA de marketing.",
      tooltip: "Chatea con L.I.A.",
      icon: "Sparkles",
      href: "/lia-chat",
      status: "active",
      required_plan: "free" as Enums["plan_type"], // Cast to required enum type
      display_order: 2,
    },
  ] as FeatureModule[], // Asegurarse de que el array se tipa como FeatureModule[]
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
 * 1. **Resolución de Error de Tipos (TS2352)**: ((Implementada)) Se ha añadido la propiedad `required_plan` a los objetos en `feature_modules` para que coincidan con la interfaz `FeatureModule` actualizada, y se han añadido `type assertions` para los valores de `enum`.
 * 2. **Coherencia de Mocks**: ((Implementada)) Los datos de prueba ahora reflejan más fielmente la estructura de datos que los componentes de la capa de presentación consumen, lo que mejora la fiabilidad de las pruebas.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática de Mocks desde Tipos**: ((Vigente)) Para evitar desincronizaciones futuras, se podría explorar una herramienta que genere datos de *mock* directamente a partir de las interfaces de TypeScript (o esquemas Zod).
 *
 * =====================================================================
 */
