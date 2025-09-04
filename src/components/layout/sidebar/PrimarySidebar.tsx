// src/components/layout/sidebar/PrimarySidebar.tsx
/**
 * @file PrimarySidebar.tsx
 * @description Orquestador de UI para la barra de navegación primaria.
 *              Ha sido refactorizado para componer aparatos hijos soberanos
 *              sin pasar props de contenido o lógica, resolviendo errores de tipo.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 7.2.0
 */
"use client";

import { Settings } from "lucide-react";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";
import { clientLogger } from "@/lib/logger";
import { primaryNavLinks } from "./primary-sidebar.config";
import { PrimarySidebarButton } from "./PrimarySidebarButton";
import { SidebarCreateButton } from "./SidebarCreateButton";
import { UserProfileWidget } from "./UserProfileWidget";

/**
 * @public
 * @component PrimarySidebar
 * @description Renderiza la barra de navegación vertical fija con los enlaces
 *              principales y el acceso al perfil de usuario.
 * @returns {React.ReactElement}
 */
export function PrimarySidebar(): React.ReactElement {
  const pathname = usePathname();
  const { user } = useDashboard();
  const { isProfileWidgetOpen, setProfileWidgetOpen } = useDashboardUIStore();
  const { tSidebar } = useDashboardTranslations();

  clientLogger.trace(
    "[PrimarySidebar] Renderizando orquestador de UI soberano."
  );

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
          {/* --- INICIO DE CORRECCIÓN HOLÍSTICA (TS2322) --- */}
          <SidebarCreateButton />
          {/* --- FIN DE CORRECCIÓN HOLÍSTICA --- */}
          {primaryNavLinks.map((link) => {
            const href =
              typeof link.href === "string" ? link.href : link.href.pathname;
            return (
              <PrimarySidebarButton
                key={href}
                href={link.href}
                label={tSidebar(link.i18nKey as any)}
                icon={link.icon}
                variant={pathname.startsWith(href) ? "active" : "default"}
              />
            );
          })}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <PrimarySidebarButton
            href="/dashboard/settings"
            label={tSidebar("settings")}
            icon={Settings}
            variant={
              pathname.startsWith("/dashboard/settings") ? "active" : "default"
            }
          />
          <Separator className="w-1/2" />
          {!isProfileWidgetOpen && (
            <Button
              variant="ghost"
              className="h-12 w-12 rounded-full p-0"
              onClick={() => setProfileWidgetOpen(true)}
              aria-label={tSidebar("userMenu_open_aria_label")}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          )}
        </nav>
      </aside>
      <div className="fixed bottom-4 left-24 z-20">
        {isProfileWidgetOpen && <UserProfileWidget />}
      </div>
    </>
  );
}
// src/components/layout/sidebar/PrimarySidebar.tsx
