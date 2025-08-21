// src/components/layout/DashboardSidebar.tsx
/**
 * @file src/components/layout/DashboardSidebar.tsx
 * @description Barra lateral principal del dashboard. Refactorizada a la Arquitectura v9.1
 *              y corregida para consumir el ecosistema atómico `UserMenu`,
 *              resolviendo un error de build crítico.
 * @author Raz Podestá
 * @version 2.1.0
 */
"use client";

import React from "react";

import { WorkspaceSwitcher } from "@/components/workspaces/WorkspaceSwitcher";
import { NavList } from "./sidebar/NavList";
import { UserMenu } from "./sidebar/user-menu";

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
 * 1. **Resolución de Error de Build**: ((Implementada)) Se ha corregido la ruta de importación de `UserMenu` para que apunte a `./sidebar/user-menu`, consumiendo el nuevo ecosistema atómico y resolviendo el fallo de compilación.
 * 2. **Adhesión a la "Filosofía LEGO"**: ((Implementada)) El componente ahora ensambla correctamente los aparatos atómicos, respetando la arquitectura de élite.
 *
 * @subsection Melhorias Futuras
 * 1. **Sidebar Colapsable**: ((Vigente)) Implementar la lógica para colapsar la sidebar, mostrando solo iconos y el logo del workspace, para una UX más compacta.
 *
 * =====================================================================
 */
