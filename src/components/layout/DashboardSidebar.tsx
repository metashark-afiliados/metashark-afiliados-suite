// src/components/layout/DashboardSidebar.tsx
/**
 * @file src/components/layout/DashboardSidebar.tsx
 * @description Barra lateral principal del dashboard. Refactorizada a la Arquitectura v9.1
 *              para actuar como el centro de navegación y contexto soberano, integrando
 *              el `WorkspaceSwitcher` en su parte superior.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import React from "react";

import { WorkspaceSwitcher } from "@/components/workspaces/WorkspaceSwitcher";
import { NavList } from "./sidebar/NavList";
import { UserMenu } from "./sidebar/UserMenu";

/**
 * @public
 * @component DashboardSidebar
 * @description Componente estructural que define el contenedor y el contenido de la
 *              barra lateral para la vista de escritorio.
 * @returns {React.ReactElement}
 */
export function DashboardSidebar(): React.ReactElement {
  return (
    <aside className="hidden border-r bg-card md:flex md:flex-col md:w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <WorkspaceSwitcher />
        </div>
        <div className="flex-1 overflow-auto">
          <NavList />
        </div>
        <UserMenu />
      </div>
    </aside>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Implementación de Arquitectura v9.1**: ((Implementada)) El `WorkspaceSwitcher` ha sido movido a la parte superior de la sidebar, fusionando la selección de contexto con la navegación principal. El `SidebarLogo` ha sido eliminado, ya que esta función ahora es responsabilidad del `WorkspaceSwitcher`.
 * 2. **Cohesión de Contexto**: ((Implementada)) La nueva estructura sigue el patrón de diseño de élite donde el contexto (workspace) se establece jerárquicamente por encima de las acciones (navegación), mejorando la claridad de la UI.
 *
 * @subsection Melhorias Futuras
 * 1. **Sidebar Colapsable**: ((Vigente)) Implementar la lógica para colapsar la sidebar, mostrando solo iconos y el logo del workspace, para una UX más compacta.
 *
 * =====================================================================
 */
// src/components/layout/DashboardSidebar.tsx
