// src/components/layout/DashboardHeader.tsx
/**
 * @file DashboardHeader.tsx
 * @description Header contextual. Refactorizado a un estándar de élite con
 *              un layout y estilo visual inspirados en las mejores prácticas.
 * @author Raz Podestá
 * @version 5.0.0
 */
"use client";

import React from "react";
import { Search } from "lucide-react";
import { useTypedTranslations } from "@/lib/i18n/hooks";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { InvitationBell } from "@/components/dashboard/InvitationBell";

export function DashboardHeader(): React.ReactElement {
  const t = useTypedTranslations("components.layout.DashboardHeader");

  return (
    <>
      <div className="flex-1">
        <span className="font-semibold text-lg">Início</span>
      </div>
      <div className="flex w-full flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {/* --- INICIO DE REFACTORIZACIÓN VISUAL --- */}
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
        {/* --- FIN DE REFACTORIZACIÓN VISUAL --- */}
        <LanguageSwitcher />
        <ThemeSwitcher />
        <InvitationBell />
      </div>
    </>
  );
}
