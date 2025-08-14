// src/components/builder/DraggableBlockWrapper.tsx
/**
 * @file DraggableBlockWrapper.tsx
 * @description Componente de Orden Superior (HOC) que envuelve cada bloque en el canvas,
 *              proporcionando interactividad (selección, D&D), aplicación de estilos
 *              dinámicos y un menú de acciones contextuales.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  GripVertical,
  MoreVertical,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBuilderStore } from "@/lib/builder/core/store";
import { type PageBlock } from "@/lib/builder/types.d";
import { logger } from "@/lib/logging";
import { cn } from "@/lib/utils";

/**
 * @public
 * @component DraggableBlockWrapper
 * @description Envuelve un componente de bloque para añadirle toda la funcionalidad del editor.
 * @param {object} props - Propiedades del componente.
 * @param {PageBlock} props.block - El objeto de datos del bloque.
 * @param {React.ReactNode} props.children - El componente de bloque a renderizar.
 * @returns {React.ReactElement}
 */
export function DraggableBlockWrapper({
  block,
  children,
}: {
  block: PageBlock;
  children: React.ReactNode;
}): React.ReactElement {
  const t = useTranslations("components.builder.BlockActions");
  const {
    selectedBlockId,
    setSelectedBlockId,
    deleteBlock,
    duplicateBlock,
    moveBlockByStep,
    campaignConfig,
  } = useBuilderStore();

  const isSelected = block.id === selectedBlockId;
  const blockIndex =
    campaignConfig?.blocks.findIndex((b) => b.id === block.id) ?? -1;
  const totalBlocks = campaignConfig?.blocks.length ?? 0;

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

  const userDefinedStyles: React.CSSProperties = {
    backgroundColor: block.styles.backgroundColor,
    color: block.styles.textColor,
    paddingTop: block.styles.paddingTop,
    paddingBottom: block.styles.paddingBottom,
    marginTop: block.styles.marginTop,
    marginBottom: block.styles.marginBottom,
  };

  const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent): void => {
    e.stopPropagation();
  };

  const handleAction = (action: () => void, actionName: string) => {
    logger.trace(`[BlockActions] Acción ejecutada: ${actionName}`, {
      blockId: block.id,
    });
    action();
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...dndStyles, ...userDefinedStyles }}
      onClick={() => handleAction(() => setSelectedBlockId(block.id), "select")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleAction(() => setSelectedBlockId(block.id), "select_keypress");
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={t("block_aria_label", { blockType: block.type })}
      className={cn(
        "relative group p-1 transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring",
        isSelected && "ring-2 ring-primary z-10"
      )}
    >
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 -left-12 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1",
          isSelected && "opacity-100"
        )}
      >
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
      </div>

      <div
        className={cn(
          "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20",
          isSelected && "opacity-100"
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="h-7 w-7"
              aria-label={t("options_menu_aria")}
              onClick={stopPropagation}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            onClick={stopPropagation}
            onKeyDown={stopPropagation}
          >
            <DropdownMenuItem
              onSelect={() =>
                handleAction(() => moveBlockByStep(block.id, "up"), "move_up")
              }
              disabled={blockIndex === 0}
            >
              <ArrowUp className="mr-2 h-4 w-4" />
              <span>{t("move_up")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                handleAction(
                  () => moveBlockByStep(block.id, "down"),
                  "move_down"
                )
              }
              disabled={blockIndex === totalBlocks - 1}
            >
              <ArrowDown className="mr-2 h-4 w-4" />
              <span>{t("move_down")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() =>
                handleAction(() => duplicateBlock(block.id), "duplicate")
              }
            >
              <Copy className="mr-2 h-4 w-4" />
              <span>{t("duplicate")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                handleAction(() => deleteBlock(block.id), "delete")
              }
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>{t("delete")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={cn(isSelected && "pointer-events-none")}>{children}</div>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Full Internacionalización y Observabilidad**: ((Implementada)) Todos los textos y acciones están ahora internacionalizados y registrados.
 * 2. **Lógica de Estado Robusta**: ((Implementada)) Los botones de acción (mover arriba/abajo) ahora se deshabilitan correctamente basándose en la posición del bloque.
 * 3. **Accesibilidad (a11y)**: ((Implementada)) Se han añadido roles y aria-labels a todos los elementos interactivos.
 *
 * @subsection Melhorias Futuras
 * 1. **Edición en Línea (Inline Editing)**: ((Vigente)) Implementar una lógica de doble clic en este wrapper que active un modo de "edición en línea" para los elementos de texto dentro del `children`, proporcionando una UX de edición aún más rápida.
 *
 * =====================================================================
 */
// src/components/builder/DraggableBlockWrapper.tsx
