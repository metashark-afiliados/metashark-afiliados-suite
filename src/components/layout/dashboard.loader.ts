// src/components/layout/dashboard.loader.ts
/**
 * @file dashboard.loader.ts
 * @description Aparato de carga de datos de élite. Ha sido refactorizado
 *              holísticamente para alinear su contrato de retorno `DashboardLayoutData`
 *              con la forma real de los datos que provee, resolviendo la cascada de
 *              errores de tipo TS2322.
 * @author Raz Podestá & L.I.A. Legacy
 * @version 8.0.0
 * @date 2025-08-29
 */
"use server";

import { cookies } from "next/headers";
import { type User } from "@supabase/supabase-js";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import {
  campaignsData,
  modules as modulesData,
  notifications,
  sites as sitesData,
  workspaces as workspacesData,
} from "@/lib/data";
import { type Invitation } from "@/lib/data/notifications";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Enums, type Tables } from "@/lib/types/database";
import { rootDomain } from "@/lib/utils";

// --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Sincronización de Contratos ---
type RecentCampaign = Pick<
  Tables<"campaigns">,
  "id" | "name" | "updated_at" | "created_at" | "creation_id"
>;

export interface DashboardLayoutData {
  user: User;
  profile: Tables<"profiles">;
  workspaces: Tables<"workspaces">[];
  activeWorkspace: Tables<"workspaces"> | null;
  activeWorkspaceRole: Enums<"workspace_role"> | null;
  pendingInvitations: Invitation[]; // <-- TIPO CORREGIDO
  modules: ReturnType<
    typeof modulesData.getFeatureModulesForUser
  > extends Promise<infer T>
    ? T
    : never;
  recentCampaigns: RecentCampaign[]; // <-- TIPO CORREGIDO
  workspaceMembers: (Tables<"workspace_members"> & {
    profiles: Tables<"profiles"> | null;
  })[];
  activeSitesCount: number;
  publishedCampaignsCount: number;
  uniqueVisitors30d: number;
  aiCreditsRemaining: number;
  maxSitesAllowed: number;
}
// --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getPlanMaxSites = (planType: Enums<"plan_type">): number => {
  const planToMaxSitesMap: Record<Enums<"plan_type">, number> = {
    free: 1,
    basic: 5,
    pro: 25,
    enterprise: 500,
  };
  return planToMaxSitesMap[planType] || 1;
};

export async function getLayoutData(): Promise<DashboardLayoutData | null> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    let profile: Tables<"profiles"> | null = null;
    let attempts = 0;
    while (!profile && attempts < 5) {
      const { data } = await supabase
        .from("profiles")
        .select("*, dashboard_layout")
        .eq("id", user.id)
        .single();
      if (data) {
        profile = data;
        break;
      }
      attempts++;
      await delay(300);
    }
    if (!profile) {
      await supabase.auth.signOut();
      return null;
    }

    const [userWorkspaces, pendingInvitations, modules] = await Promise.all([
      workspacesData.management.getWorkspacesByUserId(user.id, supabase),
      notifications.getPendingInvitationsByEmail(user.email!, supabase),
      modulesData.getFeatureModulesForUser(user, supabase),
    ]);

    const cookieStore = cookies();
    let activeWorkspaceId = cookieStore.get("active_workspace_id")?.value;
    let activeWorkspace =
      userWorkspaces.find(
        (ws: Tables<"workspaces">) => ws.id === activeWorkspaceId
      ) ||
      userWorkspaces[0] ||
      null;

    if (!activeWorkspaceId && activeWorkspace) {
      activeWorkspaceId = activeWorkspace.id;
      cookieStore.set("active_workspace_id", activeWorkspace.id, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
      });
    }

    if (!activeWorkspace) {
      return {
        user,
        profile,
        modules,
        pendingInvitations,
        workspaces: userWorkspaces,
        activeWorkspace: null,
        activeWorkspaceRole: null,
        recentCampaigns: [],
        workspaceMembers: [],
        activeSitesCount: 0,
        publishedCampaignsCount: 0,
        uniqueVisitors30d: 0,
        aiCreditsRemaining: 0,
        maxSitesAllowed: getPlanMaxSites(profile.plan_type),
      };
    }

    const { data: memberRole } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("workspace_id", activeWorkspace.id)
      .single();
    const activeWorkspaceRole = memberRole?.role || null;

    const workspaceMembers =
      await workspacesData.management.getWorkspaceMembers(
        activeWorkspace.id,
        supabase
      );

    const [
      activeSitesResult,
      publishedCampaignsResult,
      aiCreditsResult,
      recentCampaigns,
      allSitesInWorkspace,
    ] = await Promise.all([
      supabase
        .from("sites")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", activeWorkspace.id)
        .in("status", ["draft", "published"]),
      supabase
        .from("campaigns")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .eq("sites.workspace_id", activeWorkspace.id),
      supabase
        .from("user_tokens")
        .select("balance")
        .eq("user_id", user.id)
        .eq("token_type", "general_purpose")
        .single(),
      campaignsData.management.getRecentCampaignsByWorkspaceId(
        activeWorkspace.id,
        4,
        supabase
      ),
      sitesData.management.getSitesByWorkspaceId(activeWorkspace.id, {
        limit: 1000,
      }),
    ]);

    let uniqueVisitors30d = 0;
    if (allSitesInWorkspace.sites.length > 0) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { count } = await supabase
        .from("visitor_logs")
        .select("session_id", { count: "exact", head: true })
        .in(
          "landing_page",
          allSitesInWorkspace.sites.map(
            (site) => `${site.subdomain}.${rootDomain}`
          )
        )
        .gte("created_at", thirtyDaysAgo.toISOString());
      uniqueVisitors30d = count || 0;
    }

    return {
      user,
      profile,
      workspaces: userWorkspaces,
      activeWorkspace,
      activeWorkspaceRole,
      pendingInvitations,
      modules,
      recentCampaigns,
      workspaceMembers: workspaceMembers as any,
      activeSitesCount: activeSitesResult.count || 0,
      publishedCampaignsCount: publishedCampaignsResult.count || 0,
      uniqueVisitors30d,
      aiCreditsRemaining: aiCreditsResult.data?.balance || 0,
      maxSitesAllowed: getPlanMaxSites(profile.plan_type),
    };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "DashboardLayout:getLayoutData.critical",
      error as Error,
      {}
    );
    logger.error(
      `[DashboardLoader] Fallo crítico al obtener datos. Log ID: ${errorId}`
    );
    return null;
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @author Raz Podestá - MetaShark Tech
 * @version 8.0.0
 * @date 2025-08-29
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción de Métricas a la Capa de Datos**: ((Vigente)) La lógica para calcular las métricas (`activeSitesCount`, `publishedCampaignsCount`, `uniqueVisitors30d`) reside actualmente en el loader. Para una arquitectura de élite, esta lógica debería ser migrada a un nuevo aparato atómico `src/lib/data/metrics/dashboard.data.ts`, manteniendo el loader como un orquestador puro.
 * 2. **Tipado de `workspaceMembers`**: ((Vigente)) La aserción de tipo `as any` en `workspaceMembers` es una solución pragmática. La solución de élite sería refinar la función `getWorkspaceMembers` para que su tipo de retorno sea explícitamente `(Tables<'workspace_members'> & { profiles: Tables<'profiles'> | null; })[]`.
 *
 * =====================================================================
 */
// src/components/layout/dashboard.loader.ts
