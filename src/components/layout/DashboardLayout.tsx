// src/components/layout/DashboardLayout.tsx
/**
 * @file DashboardLayout.tsx
 * @description Ensamblador de UI de élite, versión 15.0. Consolida toda la
 *              lógica de la cabecera, eliminando redundancias y alineándose
 *              con la visión final de la UI.
 * @author Raz Podestá
 * @version 15.0.0
 */
"use client";

import React from "react";
import { ChevronLeft, Menu, Search } from "lucide-react";
import { useTypedTranslations } from "@/lib/i18n/hooks";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { InvitationBell } from "@/components/dashboard/InvitationBell";
import { DashboardSidebar } from "./DashboardSidebar";
import { PrimarySidebar } from "./sidebar/PrimarySidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const { isSidebarCollapsed, toggleSidebar } = useDashboardUIStore();
  const t = useTypedTranslations("components.layout.DashboardHeader");

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <PrimarySidebar />

      <div className="flex flex-1 pl-20">
        <aside
          className={cn(
            "hidden md:flex flex-col transition-all duration-300 ease-in-out bg-card",
            isSidebarCollapsed ? "w-0" : "w-64 border-r"
          )}
        >
          {!isSidebarCollapsed && <DashboardSidebar />}
        </aside>

        <div className="flex flex-1 flex-col">
          {/* --- INICIO DE HEADER CONSOLIDADO --- */}
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 hidden md:flex"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform",
                  isSidebarCollapsed && "rotate-180"
                )}
              />
            </Button>

            <span className="font-semibold text-lg flex-1">
              {isSidebarCollapsed ? "" : "Início"}
            </span>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative md:grow-0">
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
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col bg-card p-0">
                <DashboardSidebar />
              </SheetContent>
            </Sheet>
          </header>
          {/* --- FIN DE HEADER CONSOLIDADO --- */}

          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
