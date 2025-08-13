// src/components/layout/DashboardSidebar.tsx
/**
 * @file src/components/layout/DashboardSidebar.tsx
 * @description Componente ensamblador para la barra lateral del dashboard.
 *              Este aparato es un componente de cliente puro que compone los
 *              aparatos atómicos `SidebarLogo`, `NavList` y `UserMenu` para
 *              construir la interfaz de navegación completa.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import React from "react";

import { NavList } from "./sidebar/NavList";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { UserMenu } from "./sidebar/UserMenu";

/**
 * @public
 * @component DashboardSidebarContent
 * @description Contenido principal de la barra lateral. Ensambla el logo,
 *              la navegación principal y el menú de usuario. Se exporta por
 *              separado para ser reutilizado en el menú móvil (`Sheet`).
 * @returns {React.ReactElement}
 */
export function DashboardSidebarContent(): React.ReactElement {
  return (
    <>
      <SidebarLogo />
      <div className="flex-1 overflow-auto">
        <NavList />
      </div>
      <UserMenu />
    </>
  );
}

/**
 * @public
 * @component DashboardSidebar
 * @description Componente estructural que define el contenedor de la barra lateral
 *              para la vista de escritorio y controla su visibilidad.
 * @returns {React.ReactElement}
 */
export function DashboardSidebar(): React.ReactElement {
  return (
    <aside className="hidden border-r bg-card md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <DashboardSidebarContent />
      </div>
    </aside>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Sidebar Colapsable**: ((Vigente)) Implementar un botón (probablemente en el `DashboardHeader` o en el pie de la sidebar) para colapsar/expandir esta barra lateral, mostrando solo los iconos para un uso más compacto del espacio. Esto requeriría gestionar un estado de `isCollapsed` y pasarlo a los componentes hijos.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Dependencia Crítica**: ((Implementada)) La reconstrucción de este aparato resuelve una de las dependencias clave de `DashboardLayout`, acercándonos a la eliminación de la cascada de errores `TS2307`.
 * 2. **Composición Atómica**: ((Implementada)) El componente sigue perfectamente la "Filosofía LEGO", actuando como un simple ensamblador de sus partes atómicas, lo que resulta en un código limpio, legible y mantenible.
 * 3. **Reutilización para Móvil**: ((Implementada)) Al exportar `DashboardSidebarContent`, se establece un patrón de élite que permite reutilizar la misma estructura de navegación en el menú móvil (`Sheet`) sin duplicar código.
 *
 * =====================================================================
 */
// src/components/layout/DashboardSidebar.tsx
