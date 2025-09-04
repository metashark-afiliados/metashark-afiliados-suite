// src/components/workspaces/form-fields/EmailInputField.tsx
/**
 * @file EmailInputField.tsx
 * @description Componente de campo de formulario atómico y soberano. Encapsula
 *              la lógica de presentación para un campo de email y consume sus
 *              propias traducciones.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 2.0.0
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
 * @interface EmailInputFieldProps
 * @description Contrato de props para el componente.
 */
interface EmailInputFieldProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  isPending: boolean;
}

/**
 * @public
 * @component EmailInputField
 * @description Componente de presentación atómico para un campo de email.
 * @param {EmailInputFieldProps} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export function EmailInputField({
  register,
  errors,
  isPending,
}: EmailInputFieldProps): React.ReactElement {
  clientLogger.trace("[EmailInputField] Renderizando componente soberano.");
  const tForm = useTranslations(
    "components.workspaces.WorkspaceSwitcher.invite_form"
  );
  const tErrors = useTranslations("shared.ValidationErrors");

  return (
    <div className="space-y-2">
      <Label htmlFor="email">{tForm("email_label")}</Label>
      <Input
        id="email"
        type="email"
        placeholder={tForm("email_placeholder")}
        aria-invalid={!!errors.email}
        disabled={isPending}
        {...register("email")}
        hasError={!!errors.email}
      />
      {errors.email?.message && (
        <p className="text-sm text-destructive" role="alert">
          {tErrors(errors.email.message as any)}
        </p>
      )}
    </div>
  );
}
// src/components/workspaces/form-fields/EmailInputField.tsx
