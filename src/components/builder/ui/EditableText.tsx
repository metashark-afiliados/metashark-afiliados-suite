// src/components/builder/ui/EditableText.tsx
/**
 * @file EditableText.tsx
 * @description Aparato de UI polimórfico y de élite. Ha sido refactorizado
 *              holísticamente para aceptar una prop `disabled`, resolviendo
 *              errores de tipo en sus consumidores y mejorando su reutilización.
 * @author Raz Podestá - MetaShark Tech
 * @version 7.0.0
 * @date 2025-08-29
 */
"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

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
  /**
   * Si es `true`, deshabilita la edición en vivo y aplica estilos de deshabilitado.
   * @default false
   */
  disabled?: boolean;
}

export const EditableText = React.forwardRef<HTMLElement, EditableTextProps>(
  (
    {
      tag: Component,
      value,
      onSave,
      placeholder,
      className,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const textRef = React.useRef<HTMLElement | null>(null);

    const handleDoubleClick = (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;
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
      if (isEditing && !disabled && element) {
        element.focus();
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, [isEditing, disabled]);

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
        onBlur={isEditing && !disabled ? handleBlur : undefined}
        onKeyDown={isEditing && !disabled ? handleKeyDown : undefined}
        contentEditable={isEditing && !disabled}
        suppressContentEditableWarning={true}
        className={cn(
          "transition-all outline-none",
          isEditing &&
            !disabled &&
            "ring-2 ring-primary ring-offset-2 ring-offset-background cursor-text",
          !disabled && "cursor-pointer",
          !value && "text-muted-foreground italic",
          disabled && "cursor-not-allowed opacity-70",
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
 * @subsection Melhorias Futuras
 * 1. **Feedback Visual de Edición**: ((Vigente)) Añadir un pequeño icono de "lápiz" que aparezca al pasar el cursor (`onHover`) cuando el componente no está deshabilitado, para comunicar más claramente su capacidad de edición.
 * 2. **Modo de Edición con Clic Simple**: ((Vigente)) Añadir una prop opcional `editMode: 'click' | 'doubleClick'` para permitir la activación de la edición con un solo clic, lo cual puede ser más intuitivo en ciertos contextos de UI.
 * =====================================================================
 */
// src/components/builder/ui/EditableText.tsx
