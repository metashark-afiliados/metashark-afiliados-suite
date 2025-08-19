// src/components/ui/ConfirmationInput.tsx
/**
 * @file ConfirmationInput.tsx
 * @description Aparato de UI atómico y especializado. Su única responsabilidad
 *              es gestionar el estado y la lógica de un campo de entrada de texto
 *              para confirmación, informando a su padre si el texto coincide a
 *              través de un callback.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import React, { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichText } from "@/components/ui/RichText";
import { logger } from "@/lib/logging";

interface ConfirmationInputProps {
  label: React.ReactNode;
  confirmationText: string;
  onConfirmationChange: (isMatch: boolean) => void;
  isPending: boolean;
}

/**
 * @public
 * @component ConfirmationInput
 * @description Renderiza un campo de entrada de confirmación con validación en tiempo real.
 * @param {ConfirmationInputProps} props - Propiedades para configurar el componente.
 * @returns {React.ReactElement}
 */
export function ConfirmationInput({
  label,
  confirmationText,
  onConfirmationChange,
  isPending,
}: ConfirmationInputProps): React.ReactElement {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const isMatch = inputValue === confirmationText;
    logger.trace("[ConfirmationInput] Estado de coincidencia actualizado.", {
      isMatch,
    });
    onConfirmationChange(isMatch);
  }, [inputValue, confirmationText, onConfirmationChange]);

  return (
    <div className="mt-4 space-y-2">
      <Label htmlFor="confirmation-input">
        <RichText>{label}</RichText>
      </Label>
      <Input
        id="confirmation-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        autoComplete="off"
        disabled={isPending}
      />
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical**: ((Implementada)) Este nuevo aparato encapsula perfectamente la lógica del input de confirmación, cumpliendo con el Principio de Responsabilidad Única y la "Filosofía LEGO".
 * 2. **Comunicación por Callback**: ((Implementada)) El componente es 100% controlado y comunica su estado de validez a su padre a través del callback `onConfirmationChange`, un patrón de diseño de élite.
 * 3. **Full Observabilidad**: ((Implementada)) Cada cambio en el estado de coincidencia es registrado, proporcionando una visibilidad completa de la interacción del usuario.
 *
 * @subsection Melhorias Futuras
 * 1. **Feedback Visual de Coincidencia**: ((Vigente)) Se podría añadir un icono de `Check` verde dentro del `Input` cuando `isMatch` sea `true` para proporcionar un feedback visual inmediato al usuario.
 *
 * =====================================================================
 */
// src/components/ui/ConfirmationInput.tsx
