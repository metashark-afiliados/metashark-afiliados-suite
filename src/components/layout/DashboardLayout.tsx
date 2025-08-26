// src/components/layout/DashboardLayout.tsx
/**
 * @file DashboardLayout.tsx
 * @description Ensamblador de UI de élite. Simplificado para delegar el consumo
 *              de i18n a sus componentes hijos soberanos.
 * @author Raz Podestá - MetaShark Tech
 * @version 18.3.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";

import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";
import { useSyncDashboardPrefs } from "@/lib/hooks/use-sync-dashboard-prefs";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { PrimarySidebar } from "./sidebar/PrimarySidebar";
import { clientLogger } from "@/lib/logging";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  clientLogger.trace(
    "[DashboardLayout:Client] Ensamblando UI de Workspace Creativo."
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
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
