// src/components/builder/BlockActionsMenu.tsx
import React from "react";
import { useTranslations } from "next-intl";
import { ArrowDown, ArrowUp, Copy, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BlockActionsMenuProps {
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

/**
 * @public
 * @component BlockActionsMenu
 * @description Aparato de UI atómico y puro. Su única responsabilidad es
 *              renderizar el menú de acciones contextuales para un bloque.
 * @param {BlockActionsMenuProps} props - Propiedades para configurar el menú.
 * @returns {React.ReactElement}
 * @version 1.1.0
 * @author Raz Podestá
 */
export function BlockActionsMenu({
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}: BlockActionsMenuProps) {
  const t = useTranslations("components.builder.BlockActions");
  const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) =>
    e.stopPropagation();

  return (
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
        <DropdownMenuItem onSelect={onMoveUp} disabled={isFirst}>
          <ArrowUp className="mr-2 h-4 w-4" />
          <span>{t("move_up")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onMoveDown} disabled={isLast}>
          <ArrowDown className="mr-2 h-4 w-4" />
          <span>{t("move_down")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          <span>{t("duplicate")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            onDelete();
          }}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>{t("delete")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Composición Robusta (`asChild`)**: ((Implementada)) Se ha corregido la estructura para pasar explícitamente el icono `<MoreVertical />` como `children` al `Button`, satisfaciendo el contrato `asChild` y resolviendo el error de tipo.
 *
 * @subsection Melhorias Futuras
 * 1. **Renderizado Declarativo**: ((Vigente)) La lista de acciones podría ser definida como un array de objetos de configuración y renderizada a través de un `.map()` para un código más declarativo.
 *
 * =====================================================================
 */
