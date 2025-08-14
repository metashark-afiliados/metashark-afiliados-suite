// src/app/[locale]/dashboard/layout.tsx
/**
 * @file src/app/[locale]/dashboard/layout.tsx
 * @description Layout principal del dashboard. Ha sido refactorizado a un
 *              estándar de élite para eliminar la escritura ilegal de cookies,
 *              resolviendo un error crítico de runtime y alineándose con las
 *              mejores prácticas de los Server Components de Next.js.
 * @author Raz Podestá
 * @version 5.1.0
 */
import React from "react";
import { unstable_cache as cache } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type SupabaseClient, type User } from "@supabase/supabase-js";

import { CommandPalette } from "@/components/feedback/CommandPalette";
import { LiaChatWidget } from "@/components/feedback/LiaChatWidget";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { DashboardProvider } from "@/lib/context/DashboardContext";
import {
  campaignsData,
  modules as modulesData,
  notifications,
  workspaces,
} from "@/lib/data";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Database, type Tables } from "@/lib/types/database";

type Workspace = Tables<"workspaces">;
type Supabase = SupabaseClient<Database, "public">;

const getCachedLayoutData = cache(
  async (
    supabase: Supabase,
    user: User,
    activeWorkspaceId: string | undefined
  ) => {
    logger.info(
      `[Cache MISS] Obteniendo datos de layout para usuario ${user.id}.`
    );
    const [userWorkspaces, pendingInvitations, modules] = await Promise.all([
      workspaces.getWorkspacesByUserId(user.id, supabase),
      notifications.getPendingInvitationsByEmail(user.email!, supabase),
      modulesData.getFeatureModulesForUser(user, supabase),
    ]);

    let activeWorkspace: Workspace | null = null;
    if (
      activeWorkspaceId &&
      userWorkspaces.some((w) => w.id === activeWorkspaceId)
    ) {
      activeWorkspace =
        userWorkspaces.find((w) => w.id === activeWorkspaceId) || null;
    } else if (userWorkspaces.length > 0) {
      activeWorkspace = userWorkspaces[0];
    }

    let recentCampaigns: Tables<"campaigns">[] = [];
    if (activeWorkspace) {
      recentCampaigns =
        await campaignsData.management.getRecentCampaignsByWorkspaceId(
          activeWorkspace.id,
          4,
          supabase
        );
    }

    return {
      userWorkspaces,
      pendingInvitations,
      modules,
      activeWorkspace,
      recentCampaigns,
    };
  },
  ["dashboard-layout-data"],
  { revalidate: 60 }
);

async function getLayoutData() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login?next=/dashboard");
  }

  const activeWorkspaceId = cookieStore.get("active_workspace_id")?.value;

  const {
    userWorkspaces,
    pendingInvitations,
    modules,
    activeWorkspace,
    recentCampaigns,
  } = await getCachedLayoutData(supabase, user, activeWorkspaceId);

  if (userWorkspaces.length === 0 && pendingInvitations.length === 0) {
    logger.info(
      `[DashboardLayout] Usuario ${user.id} requiere onboarding. Redirigiendo a /welcome.`
    );
    return redirect("/welcome");
  }

  if (!activeWorkspace) {
    logger.warn(
      `[DashboardLayout] No se pudo determinar un workspace activo para ${user.id}. Redirigiendo a welcome.`
    );
    return redirect("/welcome");
  }

  // La escritura de cookies ha sido eliminada de este componente.

  return {
    user,
    workspaces: userWorkspaces,
    activeWorkspace,
    pendingInvitations,
    modules,
    recentCampaigns,
  };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const layoutData = await getLayoutData();
  if (!layoutData) return null;

  return (
    <DashboardProvider value={layoutData}>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <DashboardSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <DashboardHeader />
          <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </div>
        <LiaChatWidget />
        <CommandPalette />
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
 * 1. **Resolución de Error Crítico de Runtime**: ((Implementada)) Se ha eliminado la llamada ilegal a `cookieStore.set()`, resolviendo el error de runtime y alineando el componente con las reglas de los Server Components.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/layout.tsx
