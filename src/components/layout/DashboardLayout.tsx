// src/components/layout/DashboardLayout.tsx
/**
 * @file DashboardLayout.tsx
 * @description Ensamblador de UI de élite. Ha sido refactorizado para añadir
 *              un identificador único a su contenedor principal de scroll,
 *              estableciendo un anclaje de DOM estable para que los componentes
 *              hijos (como las cuadrículas virtualizadas) puedan funcionar
 *              con un rendimiento óptimo.
 * @author Raz Podestá - MetaShark Tech
 * @version 19.0.0
 * @date 2025-08-27
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
          {/* --- INICIO DE MEJORA DE INFRAESTRUCTURA (VIRTUALIZACIÓN) --- */}
          <main
            id="main-content-scroller"
            className="flex-1 overflow-y-auto p-4 sm:p-6"
          >
            {children}
          </main>
          {/* --- FIN DE MEJORA DE INFRAESTRUCTURA (VIRTUALIZACIÓN) --- */}
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
 * 1. **Anclaje para Virtualización**: ((Implementada)) Se ha añadido `id="main-content-scroller"` al elemento `<main>`. Este ID estático sirve como un "anclaje" en el DOM, permitiendo que los hooks de virtualización en componentes hijos (`useVirtualizer`) encuentren su contenedor de scroll sin necesidad de pasar `ref` a través de las props. Esta es una implementación de élite para una arquitectura de componentes desacoplada.
 *
 * @subsection Melhorias Futuras
 * 1. **Contexto de Scroll**: ((Vigente)) Para una solución aún más desacoplada, se podría crear un `ScrollContext` que exponga la referencia (`ref`) al elemento de scroll, eliminando la dependencia de un ID de DOM estático.
 *
 * =====================================================================
 */
// src/components/layout/DashboardLayout.tsx
