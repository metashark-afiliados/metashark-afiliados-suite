/**
 * @file src/app/[locale]/dashboard/layout.tsx
 * @description Layout principal del dashboard. Nivelado a un estándar de élite,
 *              ahora envuelve el contenido de la página en un Error Boundary para
 *              una máxima resiliencia de la UI.
 * @author Raz Podestá
 * @version 3.1.0
 */
import React from "react";
import { unstable_cache as cache } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type User } from "@supabase/supabase-js";

import { CommandPalette } from "@/components/feedback/CommandPalette";
import { LiaChatWidget } from "@/components/feedback/LiaChatWidget";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary"; // <-- MEJORA
import { DashboardProvider } from "@/lib/context/DashboardContext";
import { modules as modulesData, notifications, workspaces } from "@/lib/data";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

type Workspace = Tables<"workspaces">;

async function getLayoutData() {
  // ... (lógica de getLayoutData sin cambios)
  const cookieStore = cookies();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.info("[DashboardLayout] No hay sesión, redirigiendo a /login.");
    return redirect("/auth/login?next=/dashboard");
  }

  logger.trace(`[DashboardLayout] Usuario autenticado: ${user.id}`);

  const { userWorkspaces, pendingInvitations, modules } = await cache(
    async (supabaseClient: ReturnType<typeof createClient>, userObj: User) => {
      logger.info(
        `[Cache MISS] Obteniendo datos de layout para usuario ${userObj.id}.`
      );
      const [ws, inv, mods] = await Promise.all([
        workspaces.getWorkspacesByUserId(userObj.id, supabaseClient),
        notifications.getPendingInvitationsByEmail(
          userObj.email!,
          supabaseClient
        ),
        modulesData.getFeatureModulesForUser(userObj, supabaseClient),
      ]);
      return { userWorkspaces: ws, pendingInvitations: inv, modules: mods };
    },
    [`layout-data-${user.id}`],
    { tags: [`workspaces:${user.id}`, `invitations:${user.email!}`] }
  )(supabase, user);

  if (userWorkspaces.length === 0 && pendingInvitations.length === 0) {
    logger.info(
      `[DashboardLayout] Usuario ${user.id} requiere onboarding. Redirigiendo a /welcome.`
    );
    return redirect("/welcome");
  }

  const activeWorkspaceId = cookieStore.get("active_workspace_id")?.value;
  let activeWorkspace: Workspace | null = null;

  if (
    activeWorkspaceId &&
    userWorkspaces.some((ws) => ws.id === activeWorkspaceId)
  ) {
    activeWorkspace = userWorkspaces.find((ws) => ws.id === activeWorkspaceId)!;
  } else if (userWorkspaces.length > 0) {
    activeWorkspace = userWorkspaces[0];
    cookies().set("active_workspace_id", activeWorkspace.id, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
    logger.info(
      `[DashboardLayout] No hay workspace activo. Estableciendo por defecto: ${activeWorkspace.id}`
    );
  }

  if (!activeWorkspace) {
    logger.warn(
      `[DashboardLayout] No se pudo determinar el workspace activo para ${user.id}. Redirigiendo.`
    );
    return redirect("/welcome");
  }

  return {
    user,
    workspaces: userWorkspaces,
    activeWorkspace,
    pendingInvitations,
    modules,
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
 * 1. **Resiliencia de UI (Error Boundary)**: ((Implementada)) El contenido de la página (`children`) ahora está envuelto en un `ErrorBoundary`. Si una página anidada (ej. `/dashboard/sites`) falla durante el renderizado en el cliente, el layout principal no se romperá. En su lugar, se mostrará una UI de fallback con la opción de recargar, mejorando drásticamente la robustez de la aplicación.
 *
 * @subsection Melhorias Futuras
 * 1. **Fallbacks de Error Contextuales**: ((Vigente)) El `ErrorBoundary` podría aceptar una prop `fallback` para permitir que diferentes secciones de la aplicación muestren mensajes de error más específicos y contextuales.
 *
 * =====================================================================
 */
