// src/components/layout/DashboardLayout.tsx
/**
 * @file DashboardLayout.tsx
 * @description Ensamblador de UI de élite. Compone la arquitectura de doble
 *              barra lateral y el nuevo `DashboardHeader` atómico.
 * @author Raz Podestá - MetaShark Tech
 * @version 17.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";

import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { PrimarySidebar } from "./sidebar/PrimarySidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const { isSidebarCollapsed, toggleSidebar } = useDashboardUIStore();
  const { tSidebar, tWorkspaces, tHeader } = useDashboardTranslations();

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <PrimarySidebar t={tSidebar} />

      <div className="flex flex-1 pl-20">
        <aside
          className={cn(
            "hidden md:flex flex-col transition-all duration-300 ease-in-out bg-card",
            isSidebarCollapsed ? "w-0" : "w-64 border-r"
          )}
        >
          {!isSidebarCollapsed && (
            <DashboardSidebar tSidebar={tSidebar} tWorkspaces={tWorkspaces} />
          )}
        </aside>

        <div className="flex flex-1 flex-col">
          <DashboardHeader
            t={tHeader}
            tSidebar={tSidebar}
            tWorkspaces={tWorkspaces}
            isSidebarCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
          />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
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
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad de Componentes (SRP)**: ((Implementada)) La lógica de la cabecera ha sido extraída a su propio componente, haciendo que `DashboardLayout` sea un orquestador de layout más puro y simple.
 *
 * @subsection Melhorias Futuras
 * 1. **Persistencia del Estado del Layout**: ((Vigente)) El estado `isSidebarCollapsed` podría ser persistido en `localStorage` para que la preferencia del usuario se mantenga entre sesiones.
 *
 * =====================================================================
 */
// src/components/layout/DashboardLayout.tsx
