// src/components/builder/toolbar/PrimaryToolBar.tsx
/**
 * @file PrimaryToolBar.tsx
 * @description Orquestador de UI para la barra de herramientas principal.
 *              Refactorizado para ser Full Internacionalizado, consumiendo
 *              etiquetas desde la capa de i18n.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-24
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

/**
 * @public
 * @component PrimaryToolBar
 * @description Renderiza la barra de herramientas principal (primera columna) del constructor.
 * @returns {React.ReactElement}
 */
export function PrimaryToolBar(): React.ReactElement {
  // --- INICIO DE REFACTORIZACIÓN I18N ---
  const t = useTranslations("pages.BuilderPage.PrimaryToolBar");
  // --- FIN DE REFACTORIZACIÓN I18N ---
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
          // --- INICIO DE REFACTORIZACIÓN I18N ---
          label={t(tool.i18nKey as any)}
          // --- FIN DE REFACTORIZACIÓN I18N ---
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
 * 1. **Full Internacionalización**: ((Implementada)) El componente ahora consume `useTranslations` con el namespace correcto y pasa las etiquetas traducidas al `PrimaryToolBarButton`. La UI es ahora 100% traducible.
 * 2. **Cero Regresiones**: ((Implementada)) La lógica de estado y manejo de eventos no ha sido alterada, garantizando que no haya regresiones funcionales.
 *
 * @subsection Melhorias Futuras
 * 1. **Atajos de Teclado**: ((Vigente)) Implementar un `useEffect` que escuche eventos de teclado (ej. "D" para Diseño) para invocar `handleToolSelect` y cambiar rápidamente entre herramientas.
 *
 * =====================================================================
 */
// src/components/builder/toolbar/PrimaryToolBar.tsx
