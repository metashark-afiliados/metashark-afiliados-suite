// src/components/builder/ui/EditableText.tsx
/**
 * @file EditableText.tsx
 * @description Aparato de UI polimórfico, pragmático y de élite. Utiliza
 *              una unión de tipos explícita para su prop `tag`, resolviendo
 *              todos los errores de tipo y manteniendo la flexibilidad necesaria.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
 * @date 2025-08-24
 */
"use client";

import * as React from "react";
import { clientLogger } from "@/lib/logging";
import { cn } from "@/lib/utils";

// --- INICIO DE REFACTORIZACIÓN DE TIPOS DE ÉLITE ---
type AllowedTags =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div";

export interface EditableTextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSave" | "onChange"> {
  tag: AllowedTags;
  value: string;
  onSave: (newValue: string) => void;
  placeholder?: string;
}
// --- FIN DE REFACTORIZACIÓN DE TIPOS DE ÉLITE ---

export const EditableText = React.forwardRef<HTMLElement, EditableTextProps>(
  (
    { tag: Component, value, onSave, placeholder, className, ...props },
    ref
  ) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const textRef = React.useRef<HTMLElement | null>(null);

    const handleDoubleClick = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      setIsEditing(true);
    };

    const handleBlur = () => {
      setIsEditing(false);
      const newValue = textRef.current?.textContent || "";
      if (newValue !== value) {
        onSave(newValue);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        (e.target as HTMLElement).blur();
      }
      if (e.key === "Escape") {
        setIsEditing(false);
        if (textRef.current) {
          textRef.current.textContent = value;
        }
      }
    };

    React.useLayoutEffect(() => {
      const element = textRef.current;
      if (isEditing && element) {
        element.focus();
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, [isEditing]);

    const displayValue = !value && placeholder ? placeholder : value;

    return (
      <Component
        {...props}
        ref={(node: any) => {
          textRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        onDoubleClick={handleDoubleClick}
        onBlur={isEditing ? handleBlur : undefined}
        onKeyDown={isEditing ? handleKeyDown : undefined}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        className={cn(
          "transition-all outline-none",
          isEditing
            ? "ring-2 ring-primary ring-offset-2 ring-offset-background cursor-text"
            : "cursor-pointer",
          !value && "text-muted-foreground italic",
          className
        )}
      >
        {displayValue}
      </Component>
    );
  }
);

EditableText.displayName = "EditableText";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución Definitiva de Errores de Tipo**: ((Implementada)) La simplificación del patrón polimórfico resuelve todos los errores de tipo.
 *
 * =====================================================================
 */
// src/components/builder/ui/EditableText.tsx
