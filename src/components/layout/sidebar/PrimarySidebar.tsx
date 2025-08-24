// src/components/layout/sidebar/PrimarySidebar.tsx
/**
 * @file PrimarySidebar.tsx
 * @description Orquestador de UI para la barra de navegación primaria.
 *              Corregido para incluir el botón de apertura del widget de perfil y
 *              mejorar la lógica de avatar.
 * @author L.I.A. Legacy
 * @version 2.1.0
 */
"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";
import { primaryNavLinks } from "./primary-sidebar.config";
import { PrimarySidebarButton } from "./PrimarySidebarButton";
import { UserProfileWidget } from "./UserProfileWidget";

export function PrimarySidebar() {
  const t = useTranslations("components.layout.DashboardSidebar");
  const pathname = usePathname();
  const { user } = useDashboard();
  const { isProfileWidgetOpen, setProfileWidgetOpen } = useDashboardUIStore();

  const userInitials = (user?.user_metadata?.full_name || user?.email || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-20 flex-col border-r bg-card sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <Button
            size="icon"
            className="h-12 w-12 rounded-lg bg-primary text-primary-foreground text-2xl font-bold"
            aria-label={t("create_button")}
          >
            +
          </Button>

          {primaryNavLinks.map((link) => (
            <PrimarySidebarButton
              key={link.href}
              href={link.href}
              label={t(link.i18nKey)}
              icon={link.icon}
              variant={pathname.startsWith(link.href) ? "active" : "default"}
            />
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <PrimarySidebarButton
            href="/dashboard/settings"
            label={t("settings")}
            icon={Settings}
            variant={
              pathname.startsWith("/dashboard/settings") ? "active" : "default"
            }
          />
          <Separator className="w-1/2" />
          {/* --- INICIO DE CORRECCIÓN LÓGICA --- */}
          {!isProfileWidgetOpen && (
            <Button
              variant="ghost"
              className="h-12 w-12 rounded-full p-0"
              onClick={() => setProfileWidgetOpen(true)}
              aria-label="Open user profile"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          )}
          {/* --- FIN DE CORRECCIÓN LÓGICA --- */}
        </nav>
      </aside>
      <div className="fixed bottom-4 left-24 z-20">
        {isProfileWidgetOpen && <UserProfileWidget />}
      </div>
    </>
  );
}
