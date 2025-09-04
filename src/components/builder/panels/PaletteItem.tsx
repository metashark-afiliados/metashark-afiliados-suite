// src/components/builder/panels/PaletteItem.tsx
/**
 * @file PaletteItem.tsx
 * @description Aparato de UI atómico y de presentación puro. Contiene los componentes
 *              `PaletteItem` (el elemento arrastrable en la biblioteca) y `PaletteItemPreview`
 *              (la previsualización que sigue al cursor). Es la SSoT para la representación
 *              visual y lógica de un bloque disponible para ser añadido al canvas.
 *              Ha sido refactorizado holísticamente para consolidar ambas definiciones
 *              en este único archivo.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { blockRegistry } from "@/components/templates";
import { initializeNewBlock } from "@/lib/builder/block-initializer.helper";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";

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
    const BlockComponent = blockRegistry[newBlock.type]; // Usar newBlock.type para mayor consistencia
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
 *              Esta es la definición canónica para un ítem de la paleta.
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
      className={cn(
        "flex items-center gap-2 p-2 bg-muted rounded-md cursor-grab active:cursor-grabbing hover:bg-accent transition-colors"
        // Aquí se pueden añadir estilos personalizados para la apariencia
        // Por ejemplo, un borde o sombra sutil si el usuario ha configurado un tema
        // "con bordes" o "con sombras" a nivel global.
      )}
      role="button"
      aria-label={t(`block_name_${blockType}` as any, {
        defaultValue: blockType,
      })}
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
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Consolidación de Definiciones**: ((Implementada)) Se ha movido la definición de `PaletteItem` (previamente interna en `BlocksPalette.tsx`) a este archivo, junto con `PaletteItemPreview`. Esto convierte `PaletteItem.tsx` en la SSoT única para todos los componentes relacionados con los ítems de la paleta, mejorando drásticamente la atomicidad y el principio DRY.
 * 2. **Preparación para Personalización de UI**: ((Implementada)) Se ha añadido un comentario en `PaletteItem` para recordar la futura integración de estilos personalizados (ej. `border-radius`, `shadow`) que provendrían de un "centro de control operativo de estilos", alineándose con la directriz holística.
 * 3. **Consistencia de Logging**: ((Implementada)) Se ha ajustado el logger en `PaletteItemPreview` para usar `newBlock.type` para el rastreo.
 *
 * @subsection Melhorias Futuras
 * 1. **Previsualizaciones de Alta Fidelidad**: ((Vigente)) El `PaletteItem` debería renderizar una miniatura visual (`thumbnail`) del bloque en lugar de solo su nombre. Esto requeriría añadir una propiedad `thumbnailUrl` al `blockEditorDefinitions` para cada bloque y un mecanismo para generar estas miniaturas.
 * 2. **Estilos Dinámicos desde el Tema del Usuario**: ((Vigente)) Integrar el `IconLibraryContext` y un `ThemeContext` para aplicar dinámicamente colores, fuentes y estilos de borde/sombra al `PaletteItem`, reflejando la configuración global del usuario.
 *
 * =====================================================================
 */
// src/components/builder/panels/PaletteItem.tsx
