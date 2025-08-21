// src/components/ui/ConfirmationDialog.tsx
"use client";

import React from "react";
import { type LucideIcon } from "lucide-react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RichText } from "@/components/ui/RichText";
import { Button } from "@/components/ui/button";
import { ConfirmationInput } from "./ConfirmationInput";

export interface ConfirmationDialogContentProps {
  icon?: LucideIcon;
  title: string;
  description: React.ReactNode;
  confirmButtonText: string;
  cancelButtonText: string;
  confirmButtonVariant?: React.ComponentProps<typeof Button>["variant"];
  onConfirm: (formData: FormData) => void;
  onClose: () => void;
  isPending: boolean;
  hiddenInputs?: Record<string, string>;
  confirmationText?: string;
  confirmationLabel?: React.ReactNode;
}

export function ConfirmationDialogContent({
  icon: Icon,
  title,
  description,
  confirmButtonText,
  cancelButtonText,
  confirmButtonVariant = "destructive",
  onConfirm,
  onClose,
  isPending,
  hiddenInputs,
  confirmationText,
  confirmationLabel,
}: ConfirmationDialogContentProps) {
  const [isConfirmed, setIsConfirmed] = React.useState(!confirmationText);
  const isConfirmButtonDisabled = isPending || !isConfirmed;

  return (
    <DialogContent onEscapeKeyDown={onClose} onPointerDownOutside={onClose}>
      <form action={onConfirm}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {Icon && <Icon className="h-6 w-6 text-destructive" />}
            {title}
          </DialogTitle>
          <DialogDescription className="pt-2">
            <RichText>{description}</RichText>
          </DialogDescription>
        </DialogHeader>

        {confirmationText && confirmationLabel && (
          <ConfirmationInput
            label={confirmationLabel}
            confirmationText={confirmationText}
            onConfirmationChange={setIsConfirmed}
            isPending={isPending}
          />
        )}

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              {cancelButtonText}
            </Button>
          </DialogClose>
          {hiddenInputs &&
            Object.entries(hiddenInputs).map(([name, value]) => (
              <input key={name} type="hidden" name={name} value={value} />
            ))}
          <Button
            type="submit"
            variant={confirmButtonVariant}
            isLoading={isPending}
            disabled={isConfirmButtonDisabled}
          >
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
