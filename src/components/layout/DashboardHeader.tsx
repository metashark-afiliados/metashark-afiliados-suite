// src/components/layout/DashboardHeader.tsx
/**
 * @file src/components/layout/DashboardHeader.tsx
 * @description Header contextual del dashboard. Refactorizado a la Arquitectura v9.1,
 *              es ahora un componente de presentación puro cuyo contenido es dictado
 *              por la página que lo renderiza a través de props.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import React from "react";
import { Menu, Search } from "lucide-react";

import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/dashboard/Breadcrumbs";
import { InvitationBell } from "@/components/dashboard/InvitationBell";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { useCommandPaletteStore } from "@/lib/hooks/use-command-palette";
import { useTypedTranslations } from "@/lib/i18n/hooks";

import { DashboardSidebar } from "./DashboardSidebar";

export interface DashboardHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  primaryAction?: React.ReactNode;
}

export function DashboardHeader({
  breadcrumbs,
  primaryAction,
}: DashboardHeaderProps): React.ReactElement {
  const { open } = useCommandPaletteStore();
  const t = useTypedTranslations("DashboardHeader");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 sm:h-[60px] sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">{t("mobile_openMenu_sr")}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-card p-0">
          <DashboardSidebar />
        </SheetContent>
      </Sheet>

      <div className="flex-1">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="outline"
          className="gap-2 w-full max-w-[200px] justify-start text-muted-foreground hidden sm:inline-flex"
          onClick={open}
        >
          <Search className="h-4 w-4" />
          <span>{t("search_placeholder")}</span>
          <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">{t("search_command")}</span>
          </kbd>
        </Button>
        {primaryAction}
        <LanguageSwitcher />
        <ThemeSwitcher />
        <InvitationBell />
      </div>
    </header>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Implementación de Arquitectura v9.1**: ((Implementada)) Se ha eliminado el `WorkspaceSwitcher`. El header ahora es un componente de presentación puro que renderiza `breadcrumbs` y `primaryAction` dinámicamente.
 * 2. **Composición de Componentes**: ((Implementada)) El header ahora compone el nuevo `Breadcrumbs`, demostrando la "Filosofía LEGO".
 *
 * @subsection Melhorias Futuras
 * 1. **Acciones Secundarias Flexibles**: ((Vigente)) La prop `primaryAction` podría expandirse a un `actions: React.ReactNode` para permitir pasar múltiples botones o menús.
 *
 * =====================================================================
 */
// src/components/layout/DashboardHeader.tsx
