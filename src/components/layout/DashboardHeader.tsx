// src/components/layout/DashboardHeader.tsx
/**
 * @file src/components/layout/DashboardHeader.tsx
 * @description Orquestador de layout para la cabecera del dashboard. Este aparato
 *              ensambla los componentes atómicos para la navegación móvil, el
 *              conmutador de workspaces, la búsqueda y las acciones de cuenta.
 *              Su estética ha sido refinada para alinearse con la filosofía de
 *              diseño "Manus", priorizando un layout limpio y funcional.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import React from "react";
import { Menu, Search } from "lucide-react";

import { InvitationBell } from "@/components/dashboard/InvitationBell";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { WorkspaceSwitcher } from "@/components/workspaces/WorkspaceSwitcher";
import { useCommandPaletteStore } from "@/lib/hooks/use-command-palette";
import { useTypedTranslations } from "@/lib/i18n/hooks";

import { DashboardSidebarContent } from "./DashboardSidebar";

/**
 * @public
 * @component DashboardHeader
 * @description Renderiza la cabecera principal del dashboard, unificando la
 *              navegación, el contexto del workspace y las acciones del usuario.
 * @returns {React.ReactElement} El componente de cabecera del dashboard.
 */
export function DashboardHeader(): React.ReactElement {
  const { open } = useCommandPaletteStore();
  const t = useTypedTranslations("DashboardHeader");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6">
      {/* Menú Móvil (Hamburguesa) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">{t("mobile_openMenu_sr")}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-card p-0">
          <DashboardSidebarContent />
        </SheetContent>
      </Sheet>

      {/* Conmutador de Workspace (Visible en Escritorio) */}
      <div className="hidden md:block">
        <WorkspaceSwitcher />
      </div>

      {/* Acciones del Lado Derecho */}
      <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
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
 * @subsection Melhorias Futuras
 * 1. **Layouts Configurables por Usuario**: ((Vigente)) La estructura de la cabecera podría ser definida por datos (ej. un JSON de configuración en el perfil del usuario), permitiendo a los usuarios reordenar o ocultar elementos para una personalización máxima.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Cascada de Errores**: ((Implementada)) La reconstrucción de este aparato, junto con sus dependencias, resuelve la cascada final de errores `TS2307`, permitiendo que el `DashboardLayout` se compile y renderice correctamente.
 * 2. **Composición Atómica y de Élite**: ((Implementada)) El componente actúa como un orquestador puro, ensamblando sus componentes hijos (`WorkspaceSwitcher`, `InvitationBell`, etc.), lo que demuestra una arquitectura limpia y mantenible.
 * 3. **Estética "Manus"**: ((Implementada)) Se han refinado los estilos, como la altura de la barra y el espaciado, para alinearse con la estética minimalista y funcional de "Manus".
 *
 * =====================================================================
 */
// src/components/layout/DashboardHeader.tsx
