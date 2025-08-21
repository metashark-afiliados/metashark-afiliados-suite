// src/components/layout/sidebar/user-menu/UserMenuContent.tsx
/**
 * @file UserMenuContent.tsx
 * @description Aparato de UI atómico y puro. Su única responsabilidad es
 *              renderizar el contenido del menú desplegable del usuario.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";
import { LifeBuoy, LogOut, Settings } from "lucide-react";

import { signOutAction } from "@/lib/actions/session.actions";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { Link } from "@/lib/navigation";

interface UserMenuContentProps {
  userName: string;
  userEmail: string;
}

export function UserMenuContent({ userName, userEmail }: UserMenuContentProps) {
  const t = useTypedTranslations("DashboardSidebar");

  return (
    <DropdownMenuContent className="w-56" align="end" forceMount>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{userName}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {userEmail}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link href="/dashboard/settings">
          <Settings className="mr-2 h-4 w-4" />
          <span>{t("userMenu_accountSettings")}</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <LifeBuoy className="mr-2 h-4 w-4" />
        <span>{t("userMenu_support")}</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <form action={signOutAction} className="w-full">
        <button type="submit" className="w-full">
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("userMenu_signOut")}</span>
          </DropdownMenuItem>
        </button>
      </form>
    </DropdownMenuContent>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Hiper-Atomicidad (SRP)**: ((Implementada)) Componente de presentación 100% puro que solo renderiza el contenido del menú, desacoplándolo de la lógica de visibilidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Items Dinámicos**: ((Vigente)) Podría aceptar un array de `items` como prop para renderizar opciones de menú dinámicas, por ejemplo, basadas en el rol del usuario.
 *
 * =====================================================================
 */
// src/components/layout/sidebar/user-menu/UserMenuContent.tsx
