// src/components/builder/panels/ContextualPanel.tsx
/**
 * @file ContextualPanel.tsx
 * @description Orquestador de UI atómico. Renderiza el panel de herramientas
 *              contextual apropiado. Sincronizado para utilizar la ID de
 *              herramienta canónica 'add_content'.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.2.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { BlockLibrary } from "@/components/builder/panels/BlockLibrary";
import { type BuilderState } from "@/lib/builder/core";
import { useBuilderStore } from "@/lib/hooks/use-builder-store";
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
    // --- INICIO DE CORRECCIÓN SEMÁNTICA ---
    case "add_content":
      return <BlockLibrary />;
    // --- FIN DE CORRECCIÓN SEMÁNTICA ---
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
 * 1. **Resolución de Error de Tipo (TS2678)**: ((Implementada)) Se ha reemplazado el `case "design"` por `case "add_content"`, sincronizando el componente con el contrato de datos de `ContextualPanelType` y resolviendo el error de compilación.
 * 2. **Cero Regresiones**: ((Implementada)) La funcionalidad del componente permanece intacta, simplemente responde ahora al identificador semántico correcto.
 *
 * @subsection Melhorias Futuras
 * 1. **Renderizado de `TemplateGallery`**: ((Vigente)) La siguiente fase lógica sigue siendo implementar el `case "elements":` para renderizar el futuro componente `TemplateGallery.tsx`.
 * 2. **Mapeo Declarativo**: ((Vigente)) El `switch` statement podría ser reemplazado por un mapeo de objeto `Record<ContextualPanelType, React.ElementType>` para una solución más declarativa y extensible.
 *
 * =====================================================================
 */
// src/components/builder/panels/ContextualPanel.tsx
