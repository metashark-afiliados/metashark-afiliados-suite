// src/components/builder/ui/HistoryControls.tsx
/**
 * @file HistoryControls.tsx
 * @description Componente de UI atómico y puro para los controles de historial
 *              (deshacer y rehacer). Es 100% agnóstico al estado y recibe sus
 *              callbacks y estados de deshabilitación a través de props.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useTranslations } from "next-intl";
import { Redo, Undo } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface HistoryControlsProps {
  undo: () => void;
  redo: () => void;
  isUndoDisabled: boolean;
  isRedoDisabled: boolean;
}

/**
 * @public
 * @component HistoryControls
 * @description Renderiza los botones de Deshacer y Rehacer con tooltips internacionalizados.
 * @param {HistoryControlsProps} props - Las propiedades del componente.
 * @returns {React.ReactElement}
 */
export function HistoryControls({
  undo,
  redo,
  isUndoDisabled,
  isRedoDisabled,
}: HistoryControlsProps): React.ReactElement {
  const t = useTranslations("components.builder.BuilderHeader.History");

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={undo}
              disabled={isUndoDisabled}
              aria-label={t("undo_aria")}
            >
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("undo_tooltip")}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={redo}
              disabled={isRedoDisabled}
              aria-label={t("redo_aria")}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("redo_tooltip")}</p>
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
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo componente aísla perfectamente la UI de los controles de historial.
 * 2. **Componente Puro y Controlado**: ((Implementada)) No posee estado interno; su comportamiento es 100% controlado por props.
 * 3. **Full Internacionalización y Accesibilidad**: ((Implementada)) Todos los textos y `aria-labels` se consumen desde la capa de i18n.
 *
 * @subsection Melhorias Futuras
 * 1. **Atajos de Teclado**: ((Vigente)) El orquestador (`BuilderHeader`) podría pasar props adicionales para mostrar los atajos (ej. `Ctrl+Z`) en los tooltips.
 *
 * =====================================================================
 */
// src/components/builder/ui/HistoryControls.tsx
