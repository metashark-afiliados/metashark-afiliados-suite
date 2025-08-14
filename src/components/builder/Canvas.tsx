// src/components/builder/Canvas.tsx
/**
 * @file Canvas.tsx
 * @description Orquestador de UI para el lienzo de previsualización. Renderiza los
 *              bloques de la campaña dentro de un `IFrame` aislado, gestionando
 *              los estados de carga, vacío y error, y aplicando las vistas de dispositivo.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion } from "framer-motion";

import { DraggableBlockWrapper } from "@/components/builder/DraggableBlockWrapper";
import { EmptyCanvasState } from "@/components/builder/ui/EmptyCanvasState";
import { IFrame } from "@/components/builder/ui/IFrame";
import { blockRegistry } from "@/components/templates";
import { useBuilderStore } from "@/lib/builder/core/store";
import { type DevicePreview } from "@/lib/builder/core/uiSlice";
import { type PageBlock } from "@/lib/builder/types.d";
import { logger } from "@/lib/logging";

/**
 * @public
 * @component Canvas
 * @description Orquesta el renderizado del lienzo. Consume el `useBuilderStore`
 *              para renderizar dinámicamente los bloques, gestionando todos los
 *              estados visuales y la responsividad.
 * @returns {React.ReactElement}
 */
export function Canvas(): React.ReactElement {
  const t = useTranslations("components.builder.Canvas");
  const { campaignConfig, devicePreview } = useBuilderStore();

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
      className="h-full w-full mx-auto transition-all duration-300 ease-in-out bg-background"
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
                  logger.warn(
                    "[Canvas] Componente no encontrado para tipo de bloque.",
                    {
                      blockId: block.id,
                      blockType: block.type,
                    }
                  );
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
 * 1. **Arquitectura de Orquestación Atómica**: ((Implementada)) El `Canvas` ahora compone los aparatos atómicos `IFrame` y `EmptyCanvasState`, resultando en un código más limpio, mantenible y alineado con la "Filosofía LEGO".
 * 2. **Aislamiento de Estilos de Élite**: ((Implementada)) La migración al `IFrame` garantiza un renderizado de previsualización 100% aislado.
 * 3. **Full Internacionalización y Observabilidad**: ((Implementada)) Todos los estados de la UI son internacionalizados y cada punto de decisión lógico es registrado.
 *
 * @subsection Melhorias Futuras
 * 1. **Placeholder de Error de Bloque Mejorado**: ((Vigente)) El fallback para un bloque desconocido podría ser un componente visual más elaborado que muestre el `block.id` y `block.type` para facilitar la depuración.
 *
 * =====================================================================
 */
// src/components/builder/Canvas.tsx
