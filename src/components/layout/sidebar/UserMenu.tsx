/**
 * @file src/components/layout/sidebar/UserMenu.tsx
 * @description Aparato Atómico para el Menú de Perfil de Usuario.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";
import { LifeBuoy, LogOut, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { session as sessionActions } from "@/lib/actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { Link } from "@/lib/navigation";

const UserMenuSkeleton = () => (
  <div className="flex items-center gap-3 p-2">
    <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
    <div className="flex flex-col gap-1">
      <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
      <div className="h-3 w-32 animate-pulse rounded-md bg-muted" />
    </div>
  </div>
);

export function UserMenu(): React.ReactElement {
  const { user } = useDashboard();
  const t = useTypedTranslations("DashboardSidebar");

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
          <Button
            variant="ghost"
            className="flex h-auto w-full items-center justify-start gap-3 p-2 text-left"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={userAvatarUrl} alt={userName} />
              <AvatarFallback>
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium leading-none text-foreground">
                {userName}
              </p>
              <p className="truncate text-xs leading-none text-muted-foreground">
                {userEmail}
              </p>
            </div>
          </Button>
        </DropdownMenuTrigger>
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
          <form action={sessionActions.signOutAction} className="w-full">
            <button type="submit" className="w-full">
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("userMenu_signOut")}</span>
              </DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Cuenta de Usuario**: ((Implementada)) Reconstruye el componente final para la barra lateral.
 * =====================================================================
 */
