// src/components/layout/sidebar/user-menu/UserMenuContent.tsx
/**
 * @file UserMenuContent.tsx
 * @description Aparato de UI atómico y de presentación puro. Su única responsabilidad
 *              es renderizar el contenido del menú desplegable del usuario. Ha sido
 *              refactorizado a un estándar de élite para utilizar importaciones atómicas
 *              de Server Actions, resolviendo el error de build "server-only".
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import React from "react";
import { LifeBuoy, LogOut, Settings } from "lucide-react";

import { signOutAction } from "@/lib/actions/session.actions";
import {
  DropdownMenuContent as DropdownMenuContentPrimitive,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { Link } from "@/lib/navigation";

/**
 * @public
 * @interface UserMenuContentProps
 * @description Define el contrato de props para el componente `UserMenuContent`.
 */
interface UserMenuContentProps {
  userName: string;
  userEmail: string;
}

/**
 * @public
 * @component UserMenuContent
 * @description Renderiza el contenido del menú desplegable del usuario, incluyendo
 *              la información del perfil, enlaces de navegación y la acción de cierre de sesión.
 * @param {UserMenuContentProps} props - Propiedades para configurar el contenido del menú.
 * @returns {React.ReactElement} El componente de contenido del menú.
 */
export function UserMenuContent({
  userName,
  userEmail,
}: UserMenuContentProps): React.ReactElement {
  const t = useTypedTranslations("DashboardSidebar");

  return (
    <DropdownMenuContentPrimitive className="w-56" align="end" forceMount>
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
        <button type="submit" className="w-full text-left">
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("userMenu_signOut")}</span>
          </DropdownMenuItem>
        </button>
      </form>
    </DropdownMenuContentPrimitive>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Build**: ((Implementada)) Se ha reemplazado la importación masiva (`session as sessionActions`) por una importación atómica y directa de `signOutAction`. Esto resuelve definitivamente la vulnerabilidad al error "server-only" en este componente.
 * 2. **Invocación de Server Action Robusta**: ((Implementada)) El uso de `<form action={...}>` se mantiene como el método canónico y más accesible para invocar Server Actions desde componentes de cliente, garantizando la funcionalidad sin regresiones.
 *
 * @subsection Melhorias Futuras
 * 1. **Items de Menú Dinámicos**: ((Vigente)) El componente podría aceptar un array de `items` como prop para renderizar opciones de menú de forma dinámica, por ejemplo, basadas en el rol del usuario (ej. un enlace al `Dev Console` para desarrolladores).
 *
 * =====================================================================
 */
