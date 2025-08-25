// src/components/builder/Canvas.tsx
/**
 * @file Canvas.tsx
 * @description Orquestador de UI para el lienzo de previsualización. Sincronizado
 *              con la arquitectura de consumo de estado canónica, utilizando el
 *              hook `useBuilderStore` para máxima cohesión y rendimiento.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-24
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { shallow } from "zustand/shallow";

import { DraggableBlockWrapper } from "@/components/builder/DraggableBlockWrapper";
import { EmptyCanvasState } from "@/components/builder/ui/EmptyCanvasState";
import { IFrame } from "@/components/builder/ui/IFrame";
import { blockRegistry } from "@/components/templates";
import { type BuilderState } from "@/lib/builder/core";
import { type DevicePreview } from "@/lib/builder/core/uiSlice";
import { type PageBlock } from "@/lib/builder/types.d";
import { useBuilderStore } from "@/lib/hooks/use-builder-store";
import { logger } from "@/lib/logging";

/**
 * @private
 * @constant canvasSelector
 * @description Selector de estado optimizado para el Canvas. Se suscribe
 *              únicamente a los datos necesarios para el renderizado del lienzo.
 * @param {BuilderState} state - El estado completo del store.
 * @returns {object} Un objeto con las propiedades del estado suscritas.
 */
const canvasSelector = (state: BuilderState) => ({
  campaignConfig: state.campaignConfig,
  devicePreview: state.devicePreview,
});

/**
 * @public
 * @component Canvas
 * @description Renderiza el lienzo de previsualización del constructor, incluyendo
 *              los bloques de la campaña o un estado vacío.
 * @returns {React.ReactElement} El componente del lienzo.
 */
export function Canvas(): React.ReactElement {
  const t = useTranslations("components.builder.Canvas");
  const { campaignConfig, devicePreview } = useBuilderStore(
    canvasSelector,
    shallow
  );

  logger.trace("[Canvas] Renderizando lienzo.", {
    device: devicePreview,
    campaignId: campaignConfig?.id,
    blockCount: campaignConfig?.blocks?.length ?? 0,
  });

  const deviceWidths: Record<DevicePreview, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  if (!campaignConfig) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        {t("loading_config")}
      </div>
    );
  }

  const { blocks, theme } = campaignConfig;
  const blockIds = blocks.map((b: PageBlock) => b.id);

  return (
    <motion.div
      className="h-full w-full mx-auto transition-all duration-300 ease-in-out bg-background p-4"
      animate={{ maxWidth: deviceWidths[devicePreview] }}
    >
      <div className="h-full w-full overflow-hidden rounded-lg border shadow-inner">
        <IFrame theme={theme}>
          {blocks.length === 0 ? (
            <EmptyCanvasState
              title={t("empty_canvas.title")}
              description={t("empty_canvas.description")}
            />
          ) : (
            <SortableContext
              items={blockIds}
              strategy={verticalListSortingStrategy}
            >
              {blocks.map((block: PageBlock) => {
                const BlockComponent = blockRegistry[block.type];
                if (!BlockComponent) {
                  return (
                    <div
                      key={block.id}
                      className="m-2 p-4 border-2 border-dashed border-destructive bg-destructive/10 text-destructive text-center"
                    >
                      {t("unknown_block_error", { blockType: block.type })}
                    </div>
                  );
                }
                return (
                  <DraggableBlockWrapper key={block.id} block={block}>
                    <BlockComponent {...block.props} />
                  </DraggableBlockWrapper>
                );
              })}
            </SortableContext>
          )}
        </IFrame>
      </div>
    </motion.div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Errores de Compilación**: ((Implementada)) Se han corregido las importaciones para que apunten a las SSoT canónicas, resolviendo los errores `TS2694` y `TS7053`.
 * 2. **Seguridad de Tipos**: ((Implementada)) Se ha añadido el tipo explícito `PageBlock` al parámetro del `.map()`, reforzando la seguridad de tipos.
 * 3. **Documentación TSDoc Granular**: ((Implementada)) Se ha añadido TSDoc verboso para el componente y el selector de estado.
 *
 * @subsection Melhorias Futuras
 * 1. **Renderizado Virtualizado**: ((Vigente)) Para campañas con un gran número de bloques, se podría implementar `react-virtual` para renderizar solo los bloques visibles en el viewport, optimizando el rendimiento.
 * 2. **Indicador de Drop**: ((Vigente)) El componente podría suscribirse al estado de `activeId` del D&D para mostrar una línea indicadora de dónde se soltará un nuevo bloque.
 *
 * =====================================================================
 */
// src/components/builder/Canvas.tsx
