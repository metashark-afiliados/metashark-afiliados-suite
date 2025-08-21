// src/components/ui/ConfirmationInput.tsx
/**
 * @file ConfirmationInput.tsx
 * @description Aparato de UI atómico y especializado. Su única responsabilidad
 *              es gestionar el estado y la lógica de un campo de entrada de texto
 *              para confirmación. Nivelado para incluir un `data-testid` para
 *              una testeabilidad de élite.
 * @author L.I.A. Legacy
 * @version 1.1.0
 */
"use client";

import React, { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichText } from "@/components/ui/RichText";
import { clientLogger } from "@/lib/logging";

export interface ConfirmationInputProps {
  label: React.ReactNode;
  confirmationText: string;
  onConfirmationChange: (isMatch: boolean) => void;
  isPending: boolean;
}

export function ConfirmationInput({
  label,
  confirmationText,
  onConfirmationChange,
  isPending,
}: ConfirmationInputProps): React.ReactElement {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const isMatch = inputValue === confirmationText;
    clientLogger.trace(
      "[ConfirmationInput] Estado de coincidencia actualizado.",
      {
        isMatch,
      }
    );
    onConfirmationChange(isMatch);
  }, [inputValue, confirmationText, onConfirmationChange]);

  return (
    <div className="mt-4 space-y-2">
      <Label htmlFor="confirmation-input">
        <RichText>{label}</RichText>
      </Label>
      <Input
        id="confirmation-input"
        data-testid="confirmation-input" // <-- MEJORA DE TESTEABILIDAD
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        autoComplete="off"
        disabled={isPending}
        aria-describedby="confirmation-label"
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
 * 1. **Contrato de Pruebas Estable**: ((Implementada)) Se ha añadido el atributo `data-testid`. Esto proporciona un "gancho" estable para los arneses de pruebas, desacoplándolos del contenido de i18n y mejorando la robustez de la suite de pruebas.
 *
 * =====================================================================
 */
// src/components/ui/ConfirmationInput.tsx
