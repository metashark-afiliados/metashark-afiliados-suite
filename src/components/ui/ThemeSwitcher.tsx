// src/components/ui/ThemeSwitcher.tsx
/**
 * @file src/components/ui/ThemeSwitcher.tsx
 * @description Componente de cliente que permite al usuario cambiar entre
 *              los temas claro, oscuro y el predeterminado del sistema.
 *              Utiliza `next-themes` para la gestión del estado del tema y es
 *              completamente internacionalizado.
 * @author L.I.A. Legacy
 * @version 1.0.0
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

/**
 * @public
 * @component ThemeSwitcher
 * @description Renderiza un botón con un menú desplegable para cambiar el tema.
 *              El icono del botón cambia dinámicamente para reflejar el tema actual,
 *              utilizando una técnica de CSS puro con clases `dark:` para una
 *              transición fluida y sin JavaScript.
 * @returns {React.ReactElement}
 */
export function ThemeSwitcher(): React.ReactElement {
  const { setTheme } = useTheme();
  const t = useTranslations("ThemeSwitcher");

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
 * 1. **Funcionalidad de Tema**: ((Implementada)) Este nuevo aparato proporciona la funcionalidad central para la experiencia de tema dual (claro/oscuro), una pieza clave de la nueva visión de diseño.
 * 2. **Full Internacionalización**: ((Implementada)) Todos los textos, incluyendo el `aria-label` para accesibilidad, son consumidos desde la capa de `next-intl`.
 *
 * @subsection Melhorias Futuras
 * 1. **Indicador de Tema Activo**: ((Vigente)) Añadir un indicador visual (ej. un icono de `Check`) en el `DropdownMenuItem` que corresponda al tema actualmente activo (`theme` de `useTheme()`) para mejorar el feedback al usuario.
 *
 * =====================================================================
 */
// src/components/ui/ThemeSwitcher.tsx
