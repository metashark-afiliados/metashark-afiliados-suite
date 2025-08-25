// src/components/builder/panels/ContextualPanel.tsx
/**
 * @file ContextualPanel.tsx
 * @description Orquestador de UI atómico. Sincronizado para consumir la nueva
 *              arquitectura de estado y sus tipos canónicos.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-24
 */
"use client";

import { BlockLibrary } from "@/components/builder/panels/BlockLibrary";
// --- INICIO DE CORRECCIÓN DE IMPORTACIONES ---
import { type BuilderState } from "@/lib/builder/core";
import { useBuilderStore } from "@/lib/hooks/use-builder-store";
// --- FIN DE CORRECCIÓN DE IMPORTACIONES ---
import { logger } from "@/lib/logging";

const activeToolSelector = (state: BuilderState) => state.activeTool;

export function ContextualPanel(): React.ReactElement | null {
  const activeTool = useBuilderStore(activeToolSelector);

  logger.trace(
    `[ContextualPanel] Renderizando panel para la herramienta activa: ${activeTool}`
  );

  if (!activeTool) {
    return null;
  }

  switch (activeTool) {
    case "design":
      return <BlockLibrary />;
    case "elements":
    case "text":
    case "brand":
    case "uploads":
    case "tools":
      return (
        <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
          <span>Panel para '{activeTool}' en desarrollo.</span>
        </div>
      );
    default:
      logger.warn(
        `[ContextualPanel] Tipo de herramienta desconocido: ${activeTool}`
      );
      return null;
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Compilación (TS2694)**: ((Implementada)) Se ha corregido la importación de `BuilderState` para que apunte a la SSoT `@/lib/builder/core`, resolviendo el error de namespace no encontrado.
 *
 * =====================================================================
 */
// src/components/builder/panels/ContextualPanel.tsx
