// src/components/workspaces/form-fields/WorkspaceNameInputField.tsx
/**
 * @file WorkspaceNameInputField.tsx
 * @description Aparato de UI atómico y soberano. Es la SSoT para el campo de
 *              entrada del nombre de un workspace.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientLogger } from "@/lib/logger";

/**
 * @public
 * @interface WorkspaceNameInputFieldProps
 * @description Contrato de props para el componente.
 */
interface WorkspaceNameInputFieldProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  isPending: boolean;
  fieldName?: string; // Permite registrar con un nombre diferente si es necesario
}

/**
 * @public
 * @component WorkspaceNameInputField
 * @description Componente de presentación atómico para el campo de nombre de workspace.
 * @param {WorkspaceNameInputFieldProps} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export function WorkspaceNameInputField({
  register,
  errors,
  isPending,
  fieldName = "workspaceName",
}: WorkspaceNameInputFieldProps): React.ReactElement {
  clientLogger.trace(
    "[WorkspaceNameInputField] Renderizando componente soberano."
  );
  const tForm = useTranslations(
    "components.workspaces.WorkspaceSwitcher.create_form"
  );
  const tErrors = useTranslations("shared.ValidationErrors.workspaces");

  const error = errors[fieldName];

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldName}>{tForm("name_label")}</Label>
      <Input
        id={fieldName}
        placeholder={tForm("name_placeholder")}
        aria-invalid={!!error}
        disabled={isPending}
        {...register(fieldName)}
        hasError={!!error}
      />
      {error?.message && (
        <p className="text-sm text-destructive" role="alert">
          {tErrors(error.message as any)}
        </p>
      )}
    </div>
  );
}
// src/components/workspaces/form-fields/WorkspaceNameInputField.tsx
