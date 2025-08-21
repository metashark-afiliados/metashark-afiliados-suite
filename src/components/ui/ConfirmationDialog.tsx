// src/components/ui/ConfirmationDialog.tsx
/**
 * @file ConfirmationDialog.tsx
 * @description Componente de UI genérico y puro. Actúa como un layout para
 *              diálogos de confirmación, aceptando el contenido y los botones
 *              de acción como props para una máxima flexibilidad.
 * @author Raz Podestá
 * @version 3.0.0
 */
"use client";

import React from "react";
import { type LucideIcon } from "lucide-react";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RichText } from "@/components/ui/RichText";

export interface ConfirmationDialogContentProps {
  icon?: LucideIcon;
  title: string;
  description: React.ReactNode;
  body?: React.ReactNode;
  footer: React.ReactNode;
  onClose: () => void;
}

export function ConfirmationDialogContent({
  icon: Icon,
  title,
  description,
  body,
  footer,
  onClose,
}: ConfirmationDialogContentProps) {
  return (
    <DialogContent onEscapeKeyDown={onClose} onPointerDownOutside={onClose}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {Icon && <Icon className="h-6 w-6 text-destructive" />}
          {title}
        </DialogTitle>
        <DialogDescription className="pt-2">
          <RichText>{description}</RichText>
        </DialogDescription>
      </DialogHeader>

      {body}

      <DialogFooter className="mt-4">{footer}</DialogFooter>
    </DialogContent>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Layout Puro**: ((Implementada)) Se ha eliminado toda la lógica de estado interno y `cloneElement`. El componente es ahora un layout 100% puro, predecible y reutilizable.
 * 2. **API Simplificada**: ((Implementada)) El contrato de props es ahora más simple y explícito, aceptando el `body` y `footer` como nodos de React, lo que le da al consumidor control total sobre el contenido.
 *
 * =====================================================================
 */
// src/components/ui/ConfirmationDialog.tsx
