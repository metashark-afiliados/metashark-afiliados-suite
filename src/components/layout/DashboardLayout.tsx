// src/components/layout/DashboardLayout.tsx
/**
 * @file DashboardLayout.tsx
 * @description Ensamblador de UI de élite, versión 15.0. Consolida la
 *              arquitectura de doble barra lateral y la cabecera, completando la
 *              visión del "Workspace Creativo".
 * @author Raz Podestá - MetaShark Tech
 * @version 15.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { ChevronLeft, Menu, Search } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("components.layout.DashboardHeader");

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

          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Implementación de "Workspace Creativo"**: ((Implementada)) Este componente ahora implementa la arquitectura de layout final, con una barra lateral primaria persistente y una secundaria contextual y colapsable.
 * 2. **Cohesión de Componentes**: ((Implementada)) Se ha consolidado la lógica del `DashboardHeader` dentro de este layout, reduciendo la fragmentación de componentes y creando un orquestador de UI más cohesivo y mantenible.
 * 3. **Gestión de Estado de UI Desacoplado**: ((Implementada)) El estado de la barra lateral colapsable es controlado por el store global `useDashboardUIStore`, permitiendo que cualquier componente pueda interactuar con él sin acoplamiento directo.
 *
 * @subsection Melhorias Futuras
 * 1. **Persistencia del Estado del Layout**: ((Vigente)) El estado `isSidebarCollapsed` podría ser persistido en `localStorage` (a través del middleware de Zustand) para que la preferencia del usuario se mantenga entre sesiones.
 * 2. **Animaciones de Layout**: ((Vigente)) La transición del ancho de la barra lateral secundaria puede ser animada con `framer-motion` para una experiencia más fluida.
 *
 * =====================================================================
 */
// src/components/layout/DashboardLayout.tsx
