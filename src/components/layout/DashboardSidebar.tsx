// src/components/layout/DashboardSidebar.tsx
/**
 * @file DashboardSidebar.tsx
 * @description Barra lateral contextual. Refactorizada a un ensamblador puro
 *              que compone componentes soberanos y está instrumentada con
 *              observabilidad y documentación de élite.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 12.0.0
 */
"use client";

import React from "react";

import { WorkspaceSwitcher } from "@/components/workspaces/WorkspaceSwitcher";
import { NavList } from "./sidebar/NavList";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @component DashboardSidebar
 * @description Ensambla la barra lateral secundaria (contextual) del dashboard.
 *              Es un componente de cliente puro que compone aparatos soberanos.
 * @returns {React.ReactElement}
 */
export function DashboardSidebar(): React.ReactElement {
  clientLogger.trace("[DashboardSidebar] Renderizando ensamblador de UI.");

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
// src/components/layout/DashboardSidebar.tsx
