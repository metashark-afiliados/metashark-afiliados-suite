// src/components/workspaces/InviteMemberForm.tsx
/**
 * @file InviteMemberForm.tsx
 * @description Aparato de ensamblaje de UI puro. Consume el hook soberano
 *              `useInviteMemberForm`, delegando toda la lógica y resolviendo
 *              el error de tipo TS2339 de forma definitiva.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useInviteMemberForm } from "@/lib/hooks/useInviteMemberForm";
import { EmailInputField } from "./form-fields/EmailInputField";
import { RoleSelectField } from "./form-fields/RoleSelectField";
import { clientLogger } from "@/lib/logging";

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
  clientLogger.trace("[InviteMemberForm] Renderizando ensamblador de UI puro.");

  const { form, isLoading, processSubmit, t } = useInviteMemberForm({
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
// src/components/workspaces/InviteMemberForm.tsx
