// src/app/[locale]/dashboard/layout.tsx
/**
 * @file src/app/[locale]/dashboard/layout.tsx
 * @description Layout principal del dashboard, refactorizado a la Arquitectura v10.2
 *              ("Guardián de Contexto"). Implementa una lógica de selección de workspace
 *              de élite, maneja todos los casos borde (usuario nuevo, solo invitaciones,
 *              sin workspaces) y elimina la dependencia de la ruta obsoleta `/welcome`.
 * @author Raz Podestá
 * @version 10.2.0
 */
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import { CommandPalette } from "@/components/feedback/CommandPalette";
import { LiaChatWidget } from "@/components/feedback/LiaChatWidget";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { WelcomeModal } from "@/components/onboarding/WelcomeModal";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import {
  DashboardProvider,
  type DashboardContextProps,
} from "@/lib/context/DashboardContext";
import {
  campaignsData,
  modules as modulesData,
  notifications,
  workspaces,
} from "@/lib/data";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Enums } from "@/lib/types/database";

async function getLayoutData(): Promise<DashboardContextProps | null> {
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

    // --- INICIO DE LÓGICA DE CONTEXTO DE ÉLITE ---
    const activeWorkspaceId = cookieStore.get("active_workspace_id")?.value;
    let activeWorkspace =
      userWorkspaces.find((ws) => ws.id === activeWorkspaceId) || null;

    if (!activeWorkspace && userWorkspaces.length > 0) {
      activeWorkspace = userWorkspaces[0];
      logger.info(
        `[DashboardLayout] No hay cookie de workspace activa. Estableciendo el primero por defecto para ${user.id}.`
      );
    }

    if (userWorkspaces.length === 0 && pendingInvitations.length === 0) {
      logger.info(
        `[DashboardLayout] Usuario ${user.id} sin workspaces ni invitaciones. Renderizando estado vacío.`
      );
    }

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
    // --- FIN DE LÓGICA DE CONTEXTO DE ÉLITE ---

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
      "[DashboardLayout:getLayoutData] Fallo crítico.",
      error
    );
    await createPersistentErrorLog(
      "DashboardLayout:getLayoutData",
      error as Error
    );
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  logger.trace("[DashboardLayout] Renderizando layout de servidor...");
  const layoutData = await getLayoutData();

  if (!layoutData) {
    return redirect("/auth/login?next=/dashboard");
  }

  return (
    <DashboardProvider value={layoutData}>
      <div className="flex min-h-screen w-full bg-muted/40">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </div>
        <LiaChatWidget />
        <CommandPalette />
        {!layoutData.profile.has_completed_onboarding && <WelcomeModal />}
      </div>
    </DashboardProvider>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Lógica de Contexto de Élite**: ((Implementada)) El layout ahora maneja correctamente todos los casos borde: selecciona el primer workspace por defecto para nuevos usuarios, y permite el renderizado del dashboard en un estado limitado para usuarios sin workspaces (con o sin invitaciones).
 * 2. **Eliminación de Deuda Arquitectónica**: ((Implementada)) Se ha eliminado toda la lógica y redirecciones relacionadas con la ruta obsoleta `/welcome`.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/layout.tsx