// src/components/workspaces/form-fields/RoleSelectField.tsx
/**
 * @file RoleSelectField.tsx
 * @description Componente de campo de formulario atómico y soberano. Encapsula
 *              la lógica de presentación para un selector de rol y consume
 *              sus propias traducciones.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
"use client";

import React from "react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @interface RoleSelectFieldProps
 * @description Contrato de props para el componente.
 */
interface RoleSelectFieldProps {
  control: Control<any>;
  errors: FieldErrors;
  isPending: boolean;
}

/**
 * @public
 * @component RoleSelectField
 * @description Componente de presentación atómico para un campo de selección de rol.
 * @param {RoleSelectFieldProps} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export function RoleSelectField({
  control,
  errors,
  isPending,
}: RoleSelectFieldProps): React.ReactElement {
  clientLogger.trace("[RoleSelectField] Renderizando componente soberano.");
  const tForm = useTranslations(
    "components.workspaces.WorkspaceSwitcher.invite_form"
  );
  const tErrors = useTranslations("shared.ValidationErrors");

  return (
    <div className="space-y-2">
      <Label htmlFor="role">{tForm("role_label")}</Label>
      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={isPending}
          >
            <SelectTrigger id="role" aria-invalid={!!errors.role}>
              <SelectValue placeholder={tForm("role_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">{tForm("role_member")}</SelectItem>
              <SelectItem value="admin">{tForm("role_admin")}</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      {errors.role?.message && (
        <p className="text-sm text-destructive" role="alert">
          {tErrors(errors.role.message as any)}
        </p>
      )}
    </div>
  );
}
// src/components/workspaces/form-fields/RoleSelectField.tsx
