// src/components/builder/BlockDragHandle.tsx
import React from "react";
import { type DraggableSyntheticListeners } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * @public
 * @interface BlockDragHandleProps
 * @description Contrato de props para la primitiva de UI `BlockDragHandle`.
 * @author Raz Podestá
 * @version 1.1.0
 */
interface BlockDragHandleProps {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners | undefined;
}

/**
 * @public
 * @component BlockDragHandle
 * @description Renderiza la manija de arrastre (grip) para un bloque.
 * @param {BlockDragHandleProps} props - Propiedades para configurar la manija.
 * @returns {React.ReactElement}
 */
export function BlockDragHandle({
  attributes,
  listeners,
}: BlockDragHandleProps) {
  const t = useTranslations("components.builder.BlockActions");
  const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) =>
    e.stopPropagation();

  return (
    <div
      {...attributes}
      {...listeners}
      onClick={stopPropagation}
      onKeyDown={stopPropagation}
      role="button"
      tabIndex={0}
      aria-label={t("drag_handle_aria")}
      className="p-2 cursor-grab active:cursor-grabbing bg-card rounded-md border"
    >
      <GripVertical className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Robustez de Dependencia**: ((Implementada)) La importación del tipo `DraggableSyntheticListeners` ahora apunta a la API pública de `@dnd-kit/core`, resolviendo el error de build.
 *
 * =====================================================================
 */
