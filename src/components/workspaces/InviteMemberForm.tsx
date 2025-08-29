// src/components/workspaces/InviteMemberForm.tsx
/**
 * @file InviteMemberForm.tsx
 * @description Aparato de ensamblaje de UI puro. Ha sido refactorizado a un
 *              estándar de élite para consumir el hook soberano `useInviteMemberForm`,
 *              delegando toda la lógica y resolviendo el error de tipo TS2339
 *              de forma definitiva.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useInviteMemberForm } from "@/lib/hooks/useInviteMemberForm";
import { EmailInputField } from "./form-fields/EmailInputField";
import { RoleSelectField } from "./form-fields/RoleSelectField";

interface InviteMemberFormProps {
  workspaceId: string;
  onSuccess: () => void;
}

/**
 * @public
 * @component InviteMemberForm
 * @description Formulario ensamblador para invitar a un nuevo miembro. Orquesta
 *              componentes de campo atómicos y gestiona el flujo de envío
 *              consumiendo el hook `useInviteMemberForm`.
 * @param {InviteMemberFormProps} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export function InviteMemberForm({
  workspaceId,
  onSuccess,
}: InviteMemberFormProps): React.ReactElement {
  const { form, isLoading, processSubmit, t, tErrors } = useInviteMemberForm({
    workspaceId,
    onSuccess,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 relative">
      <input type="hidden" {...register("workspaceId")} />

      <EmailInputField
        register={register}
        errors={errors}
        isPending={isLoading}
      />
      <RoleSelectField
        control={control}
        errors={errors}
        isPending={isLoading}
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading
          ? t("invite_form.sending_button")
          : t("invite_form.send_button")}
      </Button>
    </form>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción de Botón de Envío**: El `Button` de envío con su lógica de estado `isLoading` es un patrón repetido. Podría ser abstraído a un componente `SubmitButton` genérico para una máxima adhesión al principio DRY.
 * 2. **Componente de Feedback de Error a Nivel de Formulario**: En lugar de mostrar solo toasts, se podría añadir un componente `FormError` en la parte superior del formulario que muestre un resumen de los errores devueltos por la Server Action.
 * 3. **Estado de "Éxito" Visual**: Tras un envío exitoso, se podría mostrar un mensaje de éxito dentro del modal antes de cerrarlo, proporcionando un feedback de UI más integrado que el `toast`.
 * =====================================================================
 */
