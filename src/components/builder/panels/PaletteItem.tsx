// src/components/builder/panels/PaletteItem.tsx
/**
 * @file PaletteItem.tsx
 * @description Aparato de UI atómico y de presentación puro. Contiene los componentes
 *              `PaletteItem` (el elemento arrastrable en la biblioteca) y `PaletteItemPreview`
 *              (la previsualización que sigue al cursor). Es la SSoT para la representación
 *              visual de un bloque disponible para ser añadido al canvas.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-24
 * @license MIT
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";

import { blockRegistry } from "@/components/templates";
import { initializeNewBlock } from "@/lib/builder/block-initializer.helper";
import { logger } from "@/lib/logging";

/**
 * @public
 * @component PaletteItemPreview
 * @description Renderiza una previsualización de un bloque cuando está siendo arrastrado
 *              desde la paleta. Es utilizado por el `DragOverlay` en el `BuilderLayout`.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.blockType - El tipo de bloque a previsualizar.
 * @returns {React.ReactElement}
 */
export function PaletteItemPreview({
  blockType,
}: {
  blockType: string;
}): React.ReactElement {
  const t = useTranslations("components.builder.BlocksPalette");
  const newBlock = initializeNewBlock(blockType);

  logger.trace(
    `[PaletteItemPreview] Renderizando previsualización de arrastre para: ${blockType}`
  );

  if (newBlock) {
    const BlockComponent = blockRegistry[blockType];
    if (BlockComponent) {
      return (
        <div className="bg-card p-2 rounded-md shadow-lg opacity-70 w-80">
          {React.createElement(BlockComponent, newBlock.props)}
        </div>
      );
    }
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-md cursor-grabbing ring-2 ring-primary">
      <GripVertical className="h-5 w-5 text-muted-foreground" />
      <span className="font-medium text-sm">
        {t("unknown_block_preview", { blockType })}
      </span>
    </div>
  );
}

/**
 * @public
 * @component PaletteItem
 * @description Renderiza un único ítem arrastrable en la biblioteca de bloques.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.blockType - El tipo de bloque que este ítem representa.
 * @returns {React.ReactElement}
 */
export function PaletteItem({
  blockType,
}: {
  blockType: string;
}): React.ReactElement {
  const t = useTranslations("components.builder.BlocksPalette");
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `palette-${blockType}`,
    data: {
      blockType: blockType,
      fromPalette: true,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 p-2 bg-muted rounded-md cursor-grab active:cursor-grabbing hover:bg-accent transition-colors"
      role="button"
      aria-label={`Añadir bloque ${blockType}`}
    >
      <GripVertical className="h-5 w-5 text-muted-foreground" />
      <span className="font-medium text-sm">
        {t(`block_name_${blockType}` as any, { defaultValue: blockType })}
      </span>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical**: ((Implementada)) Se ha extraído la lógica del ítem de la paleta a su propio módulo atómico, desacoplándolo de su contenedor anterior (`BlocksPalette`).
 * 2. **Máxima Reutilización (DRY)**: ((Implementada)) Este componente es ahora una pieza de "Lego" pura, lista para ser consumida por la nueva `BlockLibrary` sin duplicar código.
 * 3. **Accesibilidad (a11y)**: ((Implementada)) Se ha añadido `role="button"` y `aria-label` al `PaletteItem` para mejorar su accesibilidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Previsualizaciones de Alta Fidelidad**: ((Vigente)) El `PaletteItem` debería renderizar una miniatura visual (`thumbnail`) del bloque en lugar de solo su nombre. Esto requeriría añadir una propiedad `thumbnailUrl` al `blockEditorDefinitions` para cada bloque.
 * 2. **Datos de Arrastre Enriquecidos**: ((Vigente)) El objeto `data` en `useDraggable` podría ser enriquecido con más metadatos sobre el bloque (ej. dimensiones por defecto) para que el `Canvas` pueda mostrar un placeholder de "drop" más preciso.
 *
 * =====================================================================
 */
// src/components/builder/panels/PaletteItem.tsx
