// src/components/layout/DashboardSidebar.tsx
/**
 * @file DashboardSidebar.tsx
 * @description Barra lateral contextual. Ensambla y propaga las traducciones a
 *              sus componentes hijos puros.
 * @author Raz Podestá - MetaShark Tech
 * @version 8.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { type useTranslations } from "next-intl";

import { WorkspaceSwitcher } from "@/components/workspaces/WorkspaceSwitcher";
import { NavList } from "./sidebar/NavList";
import { SidebarLogo } from "./sidebar/SidebarLogo";

interface DashboardSidebarProps {
  tSidebar: ReturnType<typeof useTranslations>;
  tWorkspaces: ReturnType<typeof useTranslations>;
}

export function DashboardSidebar({
  tSidebar,
  tWorkspaces,
}: DashboardSidebarProps): React.ReactElement {
  return (
    <>
      <SidebarLogo t={tSidebar} />
      <div className="flex-1 overflow-auto mt-4">
        <WorkspaceSwitcher t={tWorkspaces} />
        <NavList t={tSidebar} />
      </div>
    </>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Propagación de Dependencias**: ((Implementada)) El componente ahora pasa correctamente las funciones de traducción a sus hijos, cumpliendo con la arquitectura de inyección de dependencias.
 *
 * =====================================================================
 */
// src/components/layout/DashboardSidebar.tsx
