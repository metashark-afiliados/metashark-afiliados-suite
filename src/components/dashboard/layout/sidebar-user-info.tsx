// src/components/dashboard/layout/sidebar-user-info.tsx
/**
 * @file sidebar-user-info.tsx
 * @description Componente de cliente atómico que renderiza la sección de información
 *              del usuario en el pie de la barra lateral del dashboard, incluyendo
 *              la lógica para el cierre de sesión.
 * @author Raz Podestá (adaptado de paddle-nextjs-starter-kit)
 * @version 1.0.0
 */
"use client";

import { MouseEvent, useTransition } from "react";
import { LogOut } from "lucide-react";

import { signOutAction } from "@/lib/actions/session.actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { Separator } from "@/components/ui/separator";

export function SidebarUserInfo() {
  const { user } = useDashboard();
  const [isPending, startTransition] = useTransition();

  function handleLogout(e: MouseEvent) {
    e.preventDefault();
    startTransition(() => {
      signOutAction();
    });
  }

  return (
    <div
      className={
        "flex flex-col items-start pb-8 px-2 text-sm font-medium lg:px-4"
      }
    >
      <Separator className={"relative mt-6 mb-6 bg-border/40"} />
      <div className={"flex w-full flex-row items-center justify-between"}>
        <div
          className={
            "flex flex-col items-start justify-center overflow-hidden text-ellipsis"
          }
        >
          <div
            className={
              "text-sm leading-5 font-semibold w-full overflow-hidden text-ellipsis"
            }
          >
            {user?.user_metadata?.full_name || "Usuario"}
          </div>
          <div
            className={
              "text-sm leading-5 text-muted-foreground w-full overflow-hidden text-ellipsis"
            }
          >
            {user?.email}
          </div>
        </div>
        <div>
          <button
            onClick={handleLogout}
            disabled={isPending}
            aria-label="Cerrar sesión"
          >
            <LogOut
              className={
                "h-6 w-6 text-muted-foreground cursor-pointer hover:text-foreground"
              }
            />
          </button>
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
 * 1. **Componente de Usuario Atómico**: ((Implementada)) Aísla la lógica y UI de la información del usuario, reemplazando la funcionalidad de nuestro ecosistema `UserMenu`.
 * 2. **Lógica de Logout Adaptada**: ((Implementada)) Utiliza `useTransition` y nuestra `signOutAction` canónica.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente `UserAvatar`**: ((Vigente)) Se podría añadir un `Avatar` junto al nombre del usuario para una UI más rica.
 *
 * =====================================================================
 */
