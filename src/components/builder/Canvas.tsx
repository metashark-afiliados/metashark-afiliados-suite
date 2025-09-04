// src/components/builder/Canvas.tsx
/**
 * @file Canvas.tsx
 * @description Orquestador de UI para el lienzo de previsualización. Consume el
 *              estado del `BuilderStore` para renderizar los bloques de la campaña.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @see .docs-espejo/components/builder/Canvas.tsx.md
 */
"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React from "react";
import { shallow } from "zustand/shallow";

import { DraggableBlockWrapper } from "@/components/builder/DraggableBlockWrapper";
import { EmptyCanvasState } from "@/components/builder/ui/EmptyCanvasState";
import { IFrame } from "@/components/builder/ui/IFrame";
import { blockRegistry } from "@/components/templates";
import { type BuilderState } from "@/lib/builder/core";
import { type DevicePreview } from "@/lib/builder/core/uiSlice";
import { type PageBlock } from "@/lib/builder/types.d";
import { useBuilderStore } from "@/lib/hooks/use-builder-store";
import { clientLogger } from "@/lib/logger";

const canvasSelector = (state: BuilderState) => ({
  campaignConfig: state.campaignConfig,
  devicePreview: state.devicePreview,
});

/**
 * @public
 * @component Canvas
 * @description Renderiza el lienzo de previsualización del constructor.
 * @returns {React.ReactElement} El componente del lienzo.
 */
export function Canvas(): React.ReactElement {
  const t = useTranslations("components.builder.Canvas");
  const { campaignConfig, devicePreview } = useBuilderStore(
    canvasSelector,
    shallow
  );

  const context = {
    device: devicePreview,
    campaignId: campaignConfig?.id,
    blockCount: campaignConfig?.blocks?.length ?? 0,
  };
  clientLogger.trace(context, "[Canvas] Renderizando lienzo.");

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
      className="h-full w-full mx-auto transition-all duration-300 bg-background p-4"
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
// src/components/builder/Canvas.tsx
