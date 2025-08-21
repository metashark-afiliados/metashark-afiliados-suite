// src/components/layout/sidebar/user-menu/UserMenu.tsx
import React from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboard } from "@/lib/context/DashboardContext";

import { UserMenuContent } from "./UserMenuContent";
import { UserMenuSkeleton } from "./UserMenuSkeleton";
import { UserMenuTrigger } from "./UserMenuTrigger";

/**
 * @public
 * @component UserMenu
 * @description Orquestador y ensamblador de élite para el ecosistema de Menú de Usuario.
 *              Consume el contexto del dashboard, gestiona el estado de carga y compone
 *              los aparatos atómicos `UserMenuTrigger`, `UserMenuContent` y
 *              `UserMenuSkeleton` para construir la funcionalidad completa.
 * @returns {React.ReactElement} El componente de menú de usuario.
 * @author Raz Podestá
 * @version 2.0.0
 */
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
 * 1. **Cohesión Estructural**: ((Implementada)) El aparato ahora reside dentro de su módulo atómico, completando la refactorización y resolviendo el error de build.
 *
 * @subsection Melhorias Futuras
 * 1. **Gestión de Estado de Apertura**: ((Vigente)) Para casos de uso avanzados, podría gestionar el estado `open` del `DropdownMenu` para permitir el cierre programático del menú desde otras acciones en la aplicación.
 *
 * =====================================================================
 */
