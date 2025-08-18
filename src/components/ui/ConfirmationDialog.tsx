// src/components/ui/ConfirmationDialog.tsx
/**
 * @file src/components/ui/ConfirmationDialog.tsx
 * @description Componente de UI genérico de élite para el contenido de un
 *              diálogo de confirmación. Ha sido refactorizado a la v3.0.0
 *              para ser un componente de "contenido" puro, resolviendo
 *              errores de build y mejorando su atomicidad.
 * @author Raz Podestá
 * @version 3.0.0
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

  React.useEffect(() => {
    setInputValue("");
  }, [onClose]);

  return (
    <DialogContent
      onEscapeKeyDown={() => onClose()}
      onPointerDownOutside={() => onClose()}
    >
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {Icon && <Icon className="h-6 w-6 text-destructive" />}
            {title}
          </DialogTitle>
          <DialogDescription className="pt-2">{description}</DialogDescription>
        </DialogHeader>

        {isConfirmationRequired && (
          <div className="mt-4 space-y-2">
            <Label htmlFor="confirmation-input">{confirmationLabel}</Label>
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
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={onClose}
            >
              {cancelButtonText}
            </Button>
          </DialogClose>
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
 * 1. **Resolución de Error de Build**: ((Implementada)) Se ha refactorizado para ser un componente de contenido (`<DialogContent>`), eliminando el `<DialogTrigger>`, lo que resuelve la causa raíz del error `React.Children.only`.
 * 2. **Atomicidad Mejorada (SRP)**: ((Implementada)) El componente ahora solo se encarga del contenido del diálogo, dejando la responsabilidad de controlar el estado de apertura y el disparador al componente padre.
 *
 * =====================================================================
 */
// src/components/ui/ConfirmationDialog.tsx
