// src/components/ui/ConfirmationDialog.tsx
/**
 * @file src/components/ui/ConfirmationDialog.tsx
 * @description Componente de UI genérico de élite para el contenido de un
 *              diálogo de confirmación. Ha sido refactorizado a la v3.2.0
 *              para corregir un error de lógica en su `useEffect` y mejorar
 *              el reseteo de estado.
 * @author Raz Podestá
 * @version 3.2.0
 */
"use client";

import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichText } from "@/components/ui/RichText";

interface ConfirmationDialogContentProps {
  icon?: React.ElementType;
  title: string;
  description: React.ReactNode;
  confirmButtonText: string;
  cancelButtonText: string;
  confirmButtonVariant?: VariantProps<typeof buttonVariants>["variant"];
  onConfirm: (formData: FormData) => void;
  isPending: boolean;
  hiddenInputs?: Record<string, string>;
  confirmationText?: string;
  confirmationLabel?: React.ReactNode;
  onClose: () => void;
}

export function ConfirmationDialogContent({
  icon: Icon,
  title,
  description,
  confirmButtonText,
  cancelButtonText,
  confirmButtonVariant = "destructive",
  onConfirm,
  isPending,
  hiddenInputs,
  confirmationText,
  confirmationLabel,
  onClose,
}: ConfirmationDialogContentProps) {
  const [inputValue, setInputValue] = React.useState("");

  const isConfirmationRequired = !!confirmationText;
  const isConfirmationMatch = inputValue === confirmationText;
  const isConfirmButtonDisabled =
    isPending || (isConfirmationRequired && !isConfirmationMatch);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isConfirmButtonDisabled) return;
    const formData = new FormData(event.currentTarget);
    onConfirm(formData);
  };

  const handleClose = () => {
    setInputValue("");
    onClose();
  };

  return (
    <DialogContent
      onEscapeKeyDown={handleClose}
      onPointerDownOutside={handleClose}
    >
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {Icon && <Icon className="h-6 w-6 text-destructive" />}
            {title}
          </DialogTitle>
          <DialogDescription className="pt-2">
            <RichText>{description}</RichText>
          </DialogDescription>
        </DialogHeader>

        {isConfirmationRequired && (
          <div className="mt-4 space-y-2">
            <Label htmlFor="confirmation-input">
              <RichText>{confirmationLabel}</RichText>
            </Label>
            <Input
              id="confirmation-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoComplete="off"
              disabled={isPending}
            />
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={handleClose}
          >
            {cancelButtonText}
          </Button>

          {hiddenInputs &&
            Object.entries(hiddenInputs).map(([name, value]) => (
              <input key={name} type="hidden" name={name} value={value} />
            ))}
          <Button
            variant={confirmButtonVariant}
            type="submit"
            disabled={isConfirmButtonDisabled}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error Lógico (TS2774)**: ((Implementada)) Se ha eliminado el `useEffect` defectuoso. La lógica de reseteo del `inputValue` se ha movido a un nuevo `handleClose` que es invocado por los eventos de cierre del diálogo (`onEscapeKeyDown`, `onPointerDownOutside`) y el botón de cancelar. Esto garantiza un comportamiento predecible y correcto.
 * 2. **Composición Segura**: ((Implementada)) El uso de `RichText` se mantiene, asegurando que el componente siga siendo robusto contra errores de composición.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Foco**: ((Vigente)) Se podría añadir lógica para enfocar automáticamente el campo de entrada de confirmación cuando el diálogo se abre, mejorando la accesibilidad y la UX.
 *
 * =====================================================================
 */
// src/components/ui/ConfirmationDialog.tsx
