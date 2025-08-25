// src/components/builder/BlockContainer.tsx
/**
 * @file BlockContainer.tsx
 * @description Aparato de UI atómico para el layout y Drag and Drop. Sincronizado
 *              con la nueva arquitectura de contexto atomizada y su ruta canónica.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-24
 * @license MIT
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
// --- INICIO DE CORRECCIÓN DE RUTA ---
import { useBlockContext } from "@/components/builder/BlockContextProvider";
// --- FIN DE CORRECCIÓN DE RUTA ---

/**
 * @public
 * @component BlockContainer
 * @description Renderiza el `div` contenedor principal de un bloque, proveyendo
 *              la funcionalidad de `useSortable` y la lógica de selección.
 * @param {object} props
 * @param {React.ReactNode} props.children - El contenido del bloque a renderizar.
 * @returns {React.ReactElement}
 */
export function BlockContainer({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const { block, isSelected, selectBlock } = useBlockContext();
  const t = useTranslations("components.builder.BlockActions");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const dndStyles: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  const combinedStyles: React.CSSProperties = { ...dndStyles, ...block.styles };

  return (
    <div
      ref={setNodeRef}
      style={combinedStyles}
      onClick={selectBlock}
      role="button"
      tabIndex={0}
      aria-label={t("block_aria_label", { blockType: block.type })}
      className={cn(
        "relative group p-1 transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring",
        isSelected && "ring-2 ring-primary z-10"
      )}
    >
      {children}
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Compilación (TS2307)**: ((Implementada)) Se ha corregido la ruta de importación de `useBlockContext`, resolviendo el error de módulo no encontrado.
 *
 * =====================================================================
 */
// src/components/builder/BlockContainer.tsx
