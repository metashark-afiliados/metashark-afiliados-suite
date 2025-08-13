/**
 * @file src/components/ui/ConfirmationDialog.tsx
 * @description Componente de UI genérico de élite para confirmación de acciones.
 *              Ha sido nivelado para ser completamente agnóstico al contenido,
 *              recibiendo todos sus textos a través de props para una
 *              internacionalización total (Full i18n).
 * @author Raz Podestá
 * @version 2.1.0
 */
"use client";

import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConfirmationDialogProps {
  triggerButton: React.ReactNode;
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
  /**
   * @property {React.ReactNode} [confirmationLabel] - El texto a mostrar
   *           encima del campo de confirmación. Puede ser un string o JSX.
   *           Requerido si `confirmationText` está presente.
   */
  confirmationLabel?: React.ReactNode;
}

export function ConfirmationDialog({
  triggerButton,
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
}: ConfirmationDialogProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

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
    if (!isOpen) {
      setInputValue("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {Icon && <Icon className="h-6 w-6 text-destructive" />}
              {title}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {description}
            </DialogDescription>
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
              <Button type="button" variant="outline" disabled={isPending}>
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
    </Dialog>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Full Internacionalización**: ((Implementada)) Se ha añadido la prop `confirmationLabel`. El componente ahora es 100% puro y agnóstico al contenido, delegando toda la responsabilidad de la internacionalización al componente padre que lo consume.
 *
 * =====================================================================
 */
