/**
 * @file PrimarySidebar.tsx
 * @description Orquestador de UI para la barra de navegación primaria.
 *              Ha sido refactorizado a un estándar de élite para consumir el
 *              namespace de i18n completo y canónico, resolviendo un error
 *              crítico de `MISSING_MESSAGE` durante el build en Vercel.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";
import { clientLogger } from "@/lib/logging";
import { SidebarCreateButton } from "./SidebarCreateButton";
import { primaryNavLinks } from "./primary-sidebar.config";
import { PrimarySidebarButton } from "./PrimarySidebarButton";
import { UserProfileWidget } from "./UserProfileWidget";

export function PrimarySidebar() {
  // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA (I18N Namespace) ---
  // Se consume el namespace completo y canónico según la SSoT (i18n.ts),
  // resolviendo el error `MISSING_MESSAGE`.
  const t = useTranslations("components.layout.DashboardSidebar");
  // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
  const pathname = usePathname();
  const { user } = useDashboard();
  const { isProfileWidgetOpen, setProfileWidgetOpen } = useDashboardUIStore();

  clientLogger.trace("[PrimarySidebar] Renderizando orquestador de UI.");

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
          <SidebarCreateButton label={t("create_button")} onClick={() => {}} />

          {primaryNavLinks.map((link) => {
            const href =
              typeof link.href === "string" ? link.href : link.href.pathname;
            return (
              <PrimarySidebarButton
                key={href}
                href={link.href}
                label={t(link.i18nKey)}
                icon={link.icon}
                variant={pathname.startsWith(href) ? "active" : "default"}
              />
            );
          })}
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
          {!isProfileWidgetOpen && (
            <Button
              variant="ghost"
              className="h-12 w-12 rounded-full p-0"
              onClick={() => setProfileWidgetOpen(true)}
              aria-label="Abrir perfil de usuario"
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de `MISSING_MESSAGE`**: ((Implementada)) Se ha corregido la llamada a `useTranslations` para que utilice el namespace completo y canónico, resolviendo el error de build en Vercel.
 *
 * @subsection Melhorias Futuras
 * 1. **Navegación Robusta**: ((Vigente)) La lógica `pathname.startsWith(href)` para determinar el estado activo es funcional pero puede ser frágil. Una solución de élite sería usar el `useSelectedLayoutSegment` de Next.js para una comparación más precisa.
 *
 * =====================================================================
 */
