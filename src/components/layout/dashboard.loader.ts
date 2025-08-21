// src/components/layout/dashboard.loader.ts
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

/**
 * @public
 * @async
 * @function getLayoutData
 * @description Función de servidor que obtiene todos los datos necesarios para
 *              hidratar los contextos del dashboard. Es la SSoT para el estado
 *              inicial de la sesión del usuario.
 * @author Raz Podestá
 * @version 1.0.0
 */
export async function getLayoutData(): Promise<DashboardLayoutData | null> {
  try {
    const cookieStore = cookies();
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile) {
      logger.error(
        `[DashboardLayout] INCONSISTENCIA: No se encontró perfil para ${user.id}.`
      );
      await supabase.auth.signOut();
      return null;
    }

    const [userWorkspaces, pendingInvitations, modules] = await Promise.all([
      workspaces.getWorkspacesByUserId(user.id, supabase),
      notifications.getPendingInvitationsByEmail(user.email!, supabase),
      modulesData.getFeatureModulesForUser(user, supabase),
    ]);

    const activeWorkspaceId = cookieStore.get("active_workspace_id")?.value;
    let activeWorkspace =
      userWorkspaces.find((ws) => ws.id === activeWorkspaceId) ||
      userWorkspaces[0] ||
      null;

    if (!activeWorkspace) {
      return {
        user,
        profile,
        modules,
        pendingInvitations,
        workspaces: [],
        activeWorkspace: null,
        activeWorkspaceRole: null,
        recentCampaigns: [],
      };
    }

    const { data: memberRole } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("workspace_id", activeWorkspace.id)
      .single();

    const activeWorkspaceRole =
      (memberRole?.role as Enums<"workspace_role">) || null;

    const recentCampaigns =
      await campaignsData.management.getRecentCampaignsByWorkspaceId(
        activeWorkspace.id,
        4,
        supabase
      );

    return {
      user,
      profile,
      workspaces: userWorkspaces,
      activeWorkspace,
      activeWorkspaceRole,
      pendingInvitations,
      modules,
      recentCampaigns,
    };
  } catch (error) {
    logger.error(
      "[DashboardLayout:getLayoutData] Fallo crítico al obtener datos de layout.",
      error
    );
    await createPersistentErrorLog(
      "DashboardLayout:getLayoutData",
      error as Error
    );
    return null;
  }
}
