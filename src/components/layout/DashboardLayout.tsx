// src/components/layout/DashboardLayout.tsx
/**
 * @file DashboardLayout.tsx
 * @description Ensamblador de UI de élite y SSoT para el "Workspace Creativo".
 *              Componente de cliente que compone el layout principal del dashboard.
 *              El componente se exporta como `DashboardLayoutClient` para evitar
 *              colisiones de nombres con el layout de servidor.
 * @author Raz Podestá - MetaShark Tech
 * @version 21.0.0
 * @date 2025-08-31
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React, { type ReactNode } from "react";

import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";
import { useSyncDashboardPrefs } from "@/lib/hooks/use-sync-dashboard-prefs";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { PrimarySidebar } from "./sidebar/PrimarySidebar";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @component DashboardLayoutClient
 * @description Ensambla la estructura visual completa del dashboard.
 * @param {{ children: ReactNode }} props - El contenido de la página a renderizar.
 * @returns {React.ReactElement}
 */
export default function DashboardLayoutClient({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  clientLogger.trace(
    "[DashboardLayoutClient] Ensamblando UI de Workspace Creativo."
  );

  useSyncDashboardPrefs();
  const { isSidebarCollapsed } = useDashboardUIStore();

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <PrimarySidebar />
      <div className="flex flex-1 pl-20">
        <aside
          className={cn(
            "hidden md:flex flex-col transition-all duration-300 ease-in-out bg-card",
            isSidebarCollapsed ? "w-0" : "w-64 border-r"
          )}
        >
          {!isSidebarCollapsed && <DashboardSidebar />}
        </aside>
        <div className="flex flex-1 flex-col">
          <DashboardHeader />
          <main
            id="main-content-scroller"
            className="flex-1 overflow-y-auto p-4 sm:p-6"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
// src/components/layout/DashboardLayout.tsx
