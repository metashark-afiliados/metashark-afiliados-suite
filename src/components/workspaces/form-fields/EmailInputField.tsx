// src/components/workspaces/form-fields/EmailInputField.tsx
import React from "react";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
 * @description Componente de presentación atómico para un campo de email en un
 *              formulario gestionado por `react-hook-form`.
 * @param {EmailInputFieldProps} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export function EmailInputField({
  register,
  errors,
  isPending,
}: EmailInputFieldProps): React.ReactElement {
  const tForm = useTranslations("WorkspaceSwitcher.invite_form");
  const tErrors = useTranslations("ValidationErrors");

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
      />
      {errors.email?.message && (
        <p className="text-sm text-destructive" role="alert">
          {tErrors(errors.email.message as any)}
        </p>
      )}
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical**: ((Implementada)) Este nuevo aparato encapsula perfectamente un único campo de formulario, mejorando la reutilización y el SRP.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente Genérico `FormField`**: ((Vigente)) Este componente podría ser generalizado aún más para aceptar `name`, `label`, y `type` como props, convirtiéndose en un `FormField` universal.
 *
 * =====================================================================
 */
// src/components/workspaces/form-fields/EmailInputField.tsx
