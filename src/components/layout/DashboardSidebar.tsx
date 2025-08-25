// src/components/layout/DashboardSidebar.tsx
/**
 * @file DashboardSidebar.tsx
 * @description Barra lateral contextual. Simplificada para eliminar el
 *              botón de "Crear" redundante.
 * @author Raz Podestá
 * @version 6.0.0
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
      {/* Botón 'Crear' eliminado por redundancia */}
      <div className="flex-1 overflow-auto mt-4">
        <WorkspaceSwitcher />
        <NavList />
      </div>
    </>
  );
}
