// src/components/dashboard/layout/dashboard-layout.tsx
/**
 * @file dashboard-layout.tsx
 * @description Ensamblador de UI de élite para el "Workspace Creativo". Ha sido
 *              refactorizado holísticamente para consumir los componentes de
 *              sidebar soberanos y correctos (`PrimarySidebar`, `DashboardSidebar`),
 *              resolviendo un error crítico de módulo no encontrado e implementando
 *              la nueva arquitectura de layout de dos columnas anidadas.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React, { type ReactNode } from "react";

import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { PrimarySidebar } from "@/components/layout/sidebar/PrimarySidebar";
import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";
import { useSyncDashboardPrefs } from "@/lib/hooks/use-sync-dashboard-prefs";
import { clientLogger } from "@/lib/logging";
import { cn } from "@/lib/utils";

/**
 * @public
 * @component DashboardLayout
 * @description Ensambla la estructura visual completa del dashboard.
 * @param {{ children: ReactNode }} props - El contenido de la página a renderizar.
 * @returns {React.ReactElement}
 */
export function DashboardLayout({ children }: { children: ReactNode }) {
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
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-29
 *
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Layouts Personalizables por Usuario:** El estado `isSidebarCollapsed` podría ser parte de un objeto de preferencias de layout más grande en `useDashboardUIStore` (y persistido en `profiles.dashboard_layout`). Esto permitiría al usuario personalizar no solo el estado de la barra lateral, sino también la disposición de los widgets en el dashboard.
 * 2. ((Vigente)) **Contexto de Scroll:** Para una solución de virtualización aún más desacoplada, se podría crear un `ScrollContext` que exponga la referencia (`ref`) al elemento `<main>`, eliminando la dependencia de un ID de DOM estático.
 *
 * =====================================================================
 */
// src/components/dashboard/layout/dashboard-layout.tsx
