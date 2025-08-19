// src/components/ui/ConfirmationDialog.tsx
/**
 * @file ConfirmationDialog.tsx
 * @description Componente de UI genérico y de élite para diálogos de confirmación.
 *              Ha sido refactorizado a la v4.0.0, siguiendo la "Filosofía LEGO",
 *              para actuar como un orquestador de layout puro que compone el
 *              nuevo átomo `ConfirmationInput`.
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
"use client";

import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RichText } from "@/components/ui/RichText";
import { logger } from "@/lib/logging";

import { ConfirmationInput } from "./ConfirmationInput"; // <-- IMPORTACIÓN ATÓMICA

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
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const isConfirmationRequired = !!confirmationText;
  const isConfirmButtonDisabled =
    isPending || (isConfirmationRequired && !isConfirmed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isConfirmButtonDisabled) return;

    logger.trace("[ConfirmationDialog] Formulario de confirmación enviado.");
    const formData = new FormData(event.currentTarget);
    onConfirm(formData);
  };

  const handleClose = React.useCallback(() => {
    logger.trace("[ConfirmationDialog] Lógica de cierre ejecutada.");
    setIsConfirmed(false); // Resetea el estado de confirmación
    onClose();
  }, [onClose]);

  return (
    <DialogContent
      onEscapeKeyDown={handleClose}
      onPointerDownOutside={handleClose}
    >
      <form ref={formRef} onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {Icon && <Icon className="h-6 w-6 text-destructive" />}
            {title}
          </DialogTitle>
          <DialogDescription className="pt-2">
            <RichText>{description}</RichText>
          </DialogDescription>
        </DialogHeader>

        {isConfirmationRequired && confirmationLabel && (
          <ConfirmationInput
            label={confirmationLabel}
            confirmationText={confirmationText}
            onConfirmationChange={setIsConfirmed}
            isPending={isPending}
          />
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
 * 1. **Composición Atómica (LEGO)**: ((Implementada)) El componente ahora delega toda la lógica del input de confirmación al nuevo átomo `ConfirmationInput`, actuando como un orquestador de layout puro y cumpliendo con la "Filosofía LEGO".
 * 2. **Lógica de Estado Simplificada**: ((Implementada)) El estado interno se ha simplificado a un único booleano `isConfirmed`, lo que hace que la lógica para deshabilitar el botón de confirmación sea más limpia y directa.
 *
 * =====================================================================
 */
// src/components/ui/ConfirmationDialog.tsx
