// src/components/layout/DashboardHeader.tsx
/**
 * @file DashboardHeader.tsx
 * @description Componente de UI atómico y de presentación puro. Renderiza la
 *              cabecera completa del dashboard y es 100% agnóstico a la lógica
 *              de estado y de i18n, recibiendo todo a través de props.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { type useTranslations } from "next-intl";
import { ChevronLeft, Menu, Search } from "lucide-react";

import { InvitationBell } from "@/components/dashboard/InvitationBell";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  t: any; // CORRECCIÓN: Flexibilizar tipo
  tSidebar: any; // CORRECCIÓN: Flexibilizar tipo
  tWorkspaces: any; // CORRECCIÓN: Flexibilizar tipo
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export function DashboardHeader({
  t,
  tSidebar,
  tWorkspaces,
  isSidebarCollapsed,
  toggleSidebar,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6">
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

      <div className="flex w-full flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground pl-8 font-normal"
          >
            {t("search_placeholder")}
            <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">{t("search_command")}</span>
            </kbd>
          </Button>
        </div>
        <LanguageSwitcher />
        <ThemeSwitcher />
        <InvitationBell />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-card p-0">
          <DashboardSidebar tSidebar={tSidebar} tWorkspaces={tWorkspaces} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
