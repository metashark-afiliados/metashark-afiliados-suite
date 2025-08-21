// src/components/layout/sidebar/user-menu/UserMenu.tsx
/**
 * @file UserMenu.tsx
 * @description Orquestador y ensamblador de élite para el ecosistema de Menú de Usuario.
 *              Consume el contexto, gestiona el estado de carga y compone los
 *              aparatos atómicos `UserMenuTrigger` y `UserMenuContent`.
 * @author Raz Podestá
 * @version 3.0.0
 */
"use client";

import React from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboard } from "@/lib/context/DashboardContext";

import { UserMenuContent } from "./UserMenuContent";
import { UserMenuSkeleton } from "./UserMenuSkeleton";
import { UserMenuTrigger } from "./UserMenuTrigger";

export function UserMenu(): React.ReactElement {
  const { user } = useDashboard();

  if (!user) {
    return <UserMenuSkeleton />;
  }

  const userName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario";
  const userEmail = user.email || "";
  const userAvatarUrl = user.user_metadata?.avatar_url || "";

  return (
    <div className="mt-auto border-t p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <UserMenuTrigger
            userName={userName}
            userEmail={userEmail}
            userAvatarUrl={userAvatarUrl}
          />
        </DropdownMenuTrigger>
        <UserMenuContent userName={userName} userEmail={userEmail} />
      </DropdownMenu>
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Ensamblaje Puro (LEGO)**: ((Implementada)) El componente ahora es un orquestador limpio y legible que solo se encarga de componer los átomos.
 * 2. **Principio de Responsabilidad Única (SRP)**: ((Implementada)) Su única responsabilidad es obtener datos del contexto y pasarlos a los componentes de presentación.
 *
 * @subsection Melhorias Futuras
 * 1. **Gestión de Estado de Apertura**: ((Vigente)) Podría gestionar el estado `open` del `DropdownMenu` para permitir el cierre programático desde otras acciones.
 *
 * =====================================================================
 */
// src/components/layout/sidebar/user-menu/UserMenu.tsx
