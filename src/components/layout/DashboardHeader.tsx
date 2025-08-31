// src/components/layout/DashboardHeader.tsx
/**
 * @file DashboardHeader.tsx
 * @description Cabecera de dashboard de élite. Ahora es un componente soberano que
 *              consume sus propias traducciones y estado de UI, e integra el nuevo
 *              componente dinámico `Breadcrumbs`.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-31
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { ChevronLeft, Menu, Search } from "lucide-react";

import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { InvitationBell } from "@/components/dashboard/InvitationBell";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { useCommandPaletteStore } from "@/lib/hooks/use-command-palette";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";
import { cn } from "@/lib/utils";
import { clientLogger } from "@/lib/logging";
import { DashboardSidebar } from "./DashboardSidebar";

/**
 * @public
 * @component DashboardHeader
 * @description Renderiza la cabecera principal del dashboard, incluyendo navegación,
 *              búsqueda y acciones de usuario. Es un componente soberano.
 * @returns {React.ReactElement}
 */
export function DashboardHeader(): React.ReactElement {
  clientLogger.trace(
    "[DashboardHeader] Renderizando cabecera de dashboard soberana."
  );

  const { isSidebarCollapsed, toggleSidebar } = useDashboardUIStore();
  const { tHeader, tSidebar } = useDashboardTranslations();
  const openCommandPalette = useCommandPaletteStore((state) => state.open);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 hidden md:flex"
          onClick={toggleSidebar}
          aria-label={tSidebar("toggle_sidebar_aria_label")}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              isSidebarCollapsed && "rotate-180"
            )}
          />
        </Button>
        <Breadcrumbs />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">{tHeader("mobile_openMenu_sr")}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-card p-0">
          <DashboardSidebar />
        </SheetContent>
      </Sheet>

      <div className="flex w-full flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="relative ml-auto flex-1 md:grow-0">
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground pl-8 font-normal"
            onClick={openCommandPalette}
            aria-label={tHeader("search_placeholder")}
          >
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            {tHeader("search_placeholder")}
            <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">{tHeader("search_command")}</span>
            </kbd>
          </Button>
        </div>
        <LanguageSwitcher />
        <ThemeSwitcher />
        <InvitationBell />
      </div>
    </header>
  );
}
// src/components/layout/DashboardHeader.tsx
