// src/app/[locale]/dashboard/layout.tsx
/**
 * @file src/app/[locale]/dashboard/layout.tsx
 * @description Layout principal del dashboard. Nivelado a un estándar de élite,
 *              se ha eliminado la modificación ilegal de cookies para cumplir con
 *              las reglas de Next.js. Ahora actúa como un lector puro del estado
 *              de la sesión para proveer el contexto a los componentes cliente.
 * @author Raz Podestá
 * @version 3.2.0
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
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { DashboardProvider } from "@/lib/context/DashboardContext";
import { modules as modulesData, notifications, workspaces } from "@/lib/data";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

type Workspace = Tables<"workspaces">;

async function getLayoutData() {
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
    // Si no hay cookie, se selecciona el primero como activo para ESTE RENDER,
    // pero ya NO se escribe la cookie aquí.
    activeWorkspace = userWorkspaces[0];
    logger.info(
      `[DashboardLayout] No hay cookie de workspace activo. Usando por defecto para render: ${activeWorkspace.id}`
    );
  }

  if (!activeWorkspace) {
    logger.warn(
      `[DashboardLayout] No se pudo determinar el workspace activo para ${user.id}. Redirigiendo.`
    );
    // Este caso puede ocurrir si un usuario tiene invitaciones pero no workspaces.
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
  // El redirect() dentro de getLayoutData maneja los casos nulos.
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
 * 1. **Resolución de Error de Runtime Crítico**: ((Implementada)) Se ha eliminado la llamada ilegal a `cookies().set()`, resolviendo el `Unhandled Runtime Error` que impedía el acceso al dashboard.
 * 2. **Cumplimiento de Arquitectura Next.js**: ((Implementada)) El componente ahora es una función de renderizado pura, cumpliendo con las reglas de los Server Components y eliminando efectos secundarios impredecibles.
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción de Lógica de Datos**: ((Vigente)) La función `getLayoutData` podría ser movida a su propio módulo en `lib/data` para una mayor atomicidad y reutilización si otros layouts la necesitaran.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/layout.tsx
