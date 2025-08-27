// src/components/sites/ViewSwitcher.tsx
/**
 * @file ViewSwitcher.tsx
 * @description Aparato de UI atómico y soberano para cambiar entre vistas.
 *              Ha sido refactorizado para ser autocontenido en su consumo de
 *              i18n, apuntando al namespace canónico y resolviendo el error de
 *              compilación TS2345.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list";

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewSwitcher({ viewMode, onViewChange }: ViewSwitcherProps) {
  // --- INICIO DE CORRECCIÓN DE SOBERANÍA I18N ---
  const t = useTypedTranslations("components.sites.SitesHeader");
  // --- FIN DE CORRECCIÓN DE SOBERANÍA I18N ---

  return (
    <TooltipProvider>
      <div className="hidden md:flex items-center gap-1 bg-muted p-1 rounded-md">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === "grid" ? "background" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onViewChange("grid")}
              aria-label={t("viewGridAria")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("viewGridTooltip")}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === "list" ? "background" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onViewChange("list")}
              aria-label={t("viewListAria")}
            >
              <List className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("viewListTooltip")}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Tipo (TS2345)**: ((Implementada)) El componente ahora utiliza `useTypedTranslations("components.sites.SitesHeader")` para cargar el namespace atómico y correcto, resolviendo la desincronización y el error de compilación.
 * 2. **Adopción de Arquitectura Soberana**: ((Implementada)) Al no depender de un hook de i18n monolítico (`useDashboardTranslations`), este componente es ahora más modular y cumple con el SRP.
 *
 * @subsection Melhorias Futuras
 * 1. **Indicador Activo Animado**: ((Vigente)) La variante `background` podría ser aplicada a través de un `motion.div` de Framer Motion para animar la transición del indicador de estado activo entre los botones, proporcionando una UX más fluida.
 *
 * =====================================================================
 */
// src/components/sites/ViewSwitcher.tsx
