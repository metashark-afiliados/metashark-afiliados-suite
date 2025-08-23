// src/components/layout/sidebar/user-menu/UserMenuContent.tsx
/**
 * @file UserMenuContent.tsx
 * @description Aparato de UI atómico y de presentación puro. Su única responsabilidad
 *              es renderizar el contenido del menú desplegable del usuario. Ha sido
 *              refactorizado a un estándar de élite para utilizar importaciones atómicas
 *              de Server Actions y `useTransition` para un feedback de UX mejorado.
 * @author Raz Podestá
 * @version 3.0.0
 */
"use client";

import React, { useTransition } from "react";
import { LifeBuoy, LogOut, Settings, Loader2 } from "lucide-react";

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
  const t = useTypedTranslations("components.layout.DashboardSidebar");
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(() => {
      signOutAction();
    });
  };

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
      <DropdownMenuItem onSelect={handleSignOut} disabled={isPending}>
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="mr-2 h-4 w-4" />
        )}
        <span>{t("userMenu_signOut")}</span>
      </DropdownMenuItem>
    </DropdownMenuContentPrimitive>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de i18n**: ((Implementada)) Se ha corregido la llamada a `useTypedTranslations` para usar el namespace canónico `"components.layout.DashboardSidebar"`, resolviendo el error de tipo `TS2345`.
 * 2. **UX Mejorada en Logout**: ((Implementada)) Se ha eliminado el tag `<form>` y se ha implementado `useTransition`. Ahora, al hacer clic en "Sign Out", el `DropdownMenuItem` se deshabilita y muestra un spinner, proporcionando un feedback de carga inmediato y evitando clics múltiples.
 *
 * @subsection Melhorias Futuras
 * 1. **Items de Menú Dinámicos**: ((Vigente)) El componente podría aceptar un array de `items` como prop para renderizar opciones de menú de forma dinámica, por ejemplo, basadas en el rol del usuario (ej. un enlace al `Dev Console` para desarrolladores).
 *
 * =====================================================================
 */
// src/components/layout/sidebar/user-menu/UserMenuContent.tsx
