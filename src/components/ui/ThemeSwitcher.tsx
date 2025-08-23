// src/components/ui/ThemeSwitcher.tsx
/**
 * @file src/components/ui/ThemeSwitcher.tsx
 * @description Componente de cliente que permite al usuario cambiar entre
 *              los temas. Ha sido refactorizado para consumir el namespace
 *              de i18n canónico.
 * @author L.I.A. Legacy
 * @version 1.1.0
 */
"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcher(): React.ReactElement {
  const { setTheme } = useTheme();
  const t = useTranslations("components.ui.ThemeSwitcher");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t("toggleTheme")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {t("light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {t("dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {t("system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de `IntlError`**: ((Implementada)) Se ha corregido la llamada a `useTranslations` para usar el namespace canónico, eliminando el error de mensaje faltante.
 *
 * =====================================================================
 */
// src/components/ui/ThemeSwitcher.tsx
