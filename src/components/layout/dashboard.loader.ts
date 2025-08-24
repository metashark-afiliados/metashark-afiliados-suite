// src/components/layout/dashboard.loader.ts
/**
 * @file dashboard.loader.ts
 * @description Aparato de carga de datos de élite para el layout del dashboard.
 *              ¡ADVERTENCIA! Esta versión ha sido modificada temporalmente para
 *              deshabilitar la comprobación de sesión y devolver datos simulados,
 *              permitiendo el acceso público al dashboard para depuración.
 * @author Raz Podestá & L.I.A. Legacy
 * @version 2.1.0 (Temporarily Unsecured)
 */
"use server";

import { cookies } from "next/headers";
import { type User } from "@supabase/supabase-js";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import {
  campaignsData,
  modules as modulesData,
  notifications,
  workspaces,
} from "@/lib/data";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Enums, type Tables } from "@/lib/types/database";
import { DEV_USER, DEV_WORKSPACE } from "@tests/mocks/data/database-state";

export interface DashboardLayoutData {
  user: User;
  profile: Tables<"profiles">;
  workspaces: Tables<"workspaces">[];
  activeWorkspace: Tables<"workspaces"> | null;
  activeWorkspaceRole: Enums<"workspace_role"> | null;
  pendingInvitations: ReturnType<
    typeof notifications.getPendingInvitationsByEmail
  > extends Promise<infer T>
    ? T
    : never;
  modules: ReturnType<
    typeof modulesData.getFeatureModulesForUser
  > extends Promise<infer T>
    ? T
    : never;
  recentCampaigns: Tables<"campaigns">[];
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getLayoutData(): Promise<DashboardLayoutData | null> {
  // --- INICIO DE MODIFICACIÓN DE SEGURIDAD ---
  // La comprobación de sesión y la redirección han sido deshabilitadas.
  // Se devuelve un objeto de datos simulado para permitir el renderizado.
  logger.warn(
    "[DashboardLayout] ADVERTENCIA: El guardián de seguridad de getLayoutData está temporalmente deshabilitado."
  );
  return {
    user: DEV_USER,
    profile: {
      id: DEV_USER.id,
      email: DEV_USER.email!,
      full_name: "Dev User",
      avatar_url: "",
      app_role: "developer",
      plan_type: "enterprise",
      has_completed_onboarding: true,
      dashboard_layout: null,
      created_at: new Date().toISOString(),
      updated_at: null,
    },
    workspaces: [DEV_WORKSPACE],
    activeWorkspace: DEV_WORKSPACE,
    activeWorkspaceRole: "owner",
    pendingInvitations: [],
    modules: [],
    recentCampaigns: [],
  };
  // --- FIN DE MODIFICACIÓN DE SEGURIDAD ---

  /*
  // CÓDIGO DE PRODUCCIÓN ORIGINAL:
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }
    // ... resto de la lógica de producción ...
  } catch (error) {
    // ... manejo de errores ...
  }
  */
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Bypass de Seguridad Completo**: ((Implementada)) Se ha deshabilitado el guardián de seguridad a nivel de Server Component, cumpliendo la directiva y permitiendo el acceso irrestricto al dashboard.
 * 2. **Renderizado con Datos Simulados**: ((Implementada)) Se proveen datos de usuario y workspace simulados para prevenir que los componentes consumidores del contexto fallen, permitiendo una depuración completa de la UI.
 *
 * =====================================================================
 */
// src/components/layout/dashboard.loader.ts
