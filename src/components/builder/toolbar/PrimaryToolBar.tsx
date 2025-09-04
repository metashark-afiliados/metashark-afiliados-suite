// src/components/builder/toolbar/PrimaryToolBar.tsx
/**
 * @file PrimaryToolBar.tsx
 * @description Orquestador de UI para la barra de herramientas principal.
 *              Refactorizado para usar el `clientLogger` con la firma correcta.
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
"use client";

import { useTranslations } from "next-intl";
import { shallow } from "zustand/shallow";

import { type BuilderState } from "@/lib/builder/core";
import { useBuilderStore } from "@/lib/hooks/use-builder-store";
import { clientLogger } from "@/lib/logger";
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

  clientLogger.trace("[PrimaryToolBar] Renderizando barra de herramientas.", {
    activeTool,
  });

  const handleToolSelect = (toolId: ContextualPanelType) => {
    const newTool = activeTool === toolId ? null : toolId;
    setActiveTool(newTool);
    clientLogger.info(
      `[PrimaryToolBar] Herramienta activa cambiada a: ${newTool || "ninguna"}`
    );
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
// src/components/builder/toolbar/PrimaryToolBar.tsx
