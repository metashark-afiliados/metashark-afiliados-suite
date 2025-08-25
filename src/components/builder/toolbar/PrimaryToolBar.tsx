// src/components/builder/toolbar/PrimaryToolBar.tsx
/**
 * @file PrimaryToolBar.tsx
 * @description Orquestador de UI para la barra de herramientas principal.
 *              Sincronizado para consumir la nueva clave de i18n `add_content`.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.1.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";
import { shallow } from "zustand/shallow";

import { type BuilderState } from "@/lib/builder/core";
import { useBuilderStore } from "@/lib/hooks/use-builder-store";
import { logger } from "@/lib/logging";
import {
  PRIMARY_TOOLS_CONFIG,
  type ContextualPanelType,
} from "./PrimaryToolBar.config";
import { PrimaryToolBarButton } from "./PrimaryToolBarButton";

const primaryToolBarSelector = (state: BuilderState) => ({
  activeTool: state.activeTool,
  setActiveTool: state.setActiveTool,
});

export function PrimaryToolBar(): React.ReactElement {
  const t = useTranslations("pages.BuilderPage.PrimaryToolBar");
  const { activeTool, setActiveTool } = useBuilderStore(
    primaryToolBarSelector,
    shallow
  );

  logger.trace("[PrimaryToolBar] Renderizando barra de herramientas.", {
    activeTool,
  });

  const handleToolSelect = (toolId: ContextualPanelType) => {
    const newTool = activeTool === toolId ? null : toolId;
    setActiveTool(newTool);
    logger.info(`[PrimaryToolBar] Herramienta activa cambiada a: ${newTool}`);
  };

  return (
    <nav className="flex flex-col items-center gap-2 p-2 h-full">
      {PRIMARY_TOOLS_CONFIG.map((tool) => (
        <PrimaryToolBarButton
          key={tool.id}
          iconName={tool.iconName}
          label={t(tool.i18nKey as any)}
          variant={activeTool === tool.id ? "active" : "default"}
          onClick={() => handleToolSelect(tool.id)}
          aria-pressed={activeTool === tool.id}
        />
      ))}
    </nav>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cero Regresiones**: ((Implementada)) El componente se mantiene funcionalmente idéntico, simplemente consumiendo las nuevas claves semánticas desde sus manifiestos actualizados.
 *
 * =====================================================================
 */
// src/components/builder/toolbar/PrimaryToolBar.tsx
