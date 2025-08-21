// src/components/workspaces/form-fields/RoleSelectField.tsx
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
 * @description Componente de presentación atómico para un campo de selección de rol
 *              en un formulario gestionado por `react-hook-form`.
 * @param {RoleSelectFieldProps} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export function RoleSelectField({
  control,
  errors,
  isPending,
}: RoleSelectFieldProps): React.ReactElement {
  const tForm = useTranslations("WorkspaceSwitcher.invite_form");
  const tErrors = useTranslations("ValidationErrors");

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
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Encapsulamiento del `Controller`**: ((Implementada)) Este componente abstrae el uso del `Controller` de `react-hook-form`, que es necesario para componentes de UI controlados como `Select`. Esto simplifica el formulario padre.
 * 2. **Reutilización y SRP**: ((Implementada)) Crea un componente reutilizable para la selección de roles, que podría ser usado en otros formularios (ej. un futuro panel de gestión de miembros).
 *
 * @subsection Melhorias Futuras
 * 1. **Opciones Dinámicas**: ((Vigente)) El componente podría ser generalizado para aceptar un array de `options` como prop, convirtiéndolo en un `GenericSelectField` para cualquier tipo de selección.
 *
 * =====================================================================
 */
// src/components/workspaces/form-fields/RoleSelectField.tsx
