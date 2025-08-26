// src/components/layout/DashboardSidebar.tsx
/**
 * @file DashboardSidebar.tsx
 * @description Barra lateral contextual. Refactorizada a un ensamblador puro
 *              que compone componentes soberanos.
 * @author Raz Podestá - MetaShark Tech
 * @version 11.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";

import { WorkspaceSwitcher } from "@/components/workspaces/WorkspaceSwitcher";
import { NavList } from "./sidebar/NavList";
import { SidebarLogo } from "./sidebar/SidebarLogo";

export function DashboardSidebar(): React.ReactElement {
  return (
    <>
      <SidebarLogo />
      <div className="flex-1 overflow-auto mt-4">
        <WorkspaceSwitcher />
        <NavList />
      </div>
    </>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Resolución de Errores de Tipo:** La refactorización a componentes soberanos resuelve toda la cascada de errores.
 * =====================================================================
 */
// src/components/layout/DashboardSidebar.tsx
