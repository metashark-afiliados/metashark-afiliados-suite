// src/components/workspaces/InviteMemberForm.tsx
import { useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { invitations as invitationActions } from "@/lib/actions";
import { clientLogger } from "@/lib/logging";
import { InvitationClientSchema } from "@/lib/validators";
import { EmailInputField } from "./form-fields/EmailInputField";
import { RoleSelectField } from "./form-fields/RoleSelectField";

type FormData = z.infer<typeof InvitationClientSchema>;

interface InviteMemberFormProps {
  workspaceId: string;
  onSuccess: () => void;
}

/**
 * @public
 * @component InviteMemberForm
 * @description Formulario ensamblador para invitar a un nuevo miembro. Orquesta
 *              componentes de campo atómicos y gestiona el flujo de envío.
 * @param {InviteMemberFormProps} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export function InviteMemberForm({
  workspaceId,
  onSuccess,
}: InviteMemberFormProps): React.ReactElement {
  const t = useTranslations("WorkspaceSwitcher");
  const tErrors = useTranslations("ValidationErrors");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(InvitationClientSchema),
    defaultValues: {
      workspaceId,
      role: "member",
      email: "",
    },
  });

  const processSubmit: SubmitHandler<FormData> = (data) => {
    clientLogger.trace("[InviteMemberForm] Enviando invitación.", data);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("role", data.role);
      formData.append("workspaceId", data.workspaceId);

      const result =
        await invitationActions.sendWorkspaceInvitationAction(formData);

      if (result.success) {
        toast.success(result.data.message);
        reset();
        onSuccess();
      } else {
        toast.error(
          tErrors(result.error as any, { defaultValue: result.error })
        );
      }
    });
  };

  const isLoading = isSubmitting || isPending;

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
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Ensamblaje (LEGO)**: ((Implementada)) El formulario ahora es un orquestador puro que compone los átomos `EmailInputField` y `RoleSelectField`. Esto reduce drásticamente su complejidad y mejora la legibilidad.
 * 2. **Máxima Cohesión**: ((Implementada)) La responsabilidad del formulario está ahora claramente definida: gestionar el estado del formulario y orquestar sus componentes hijos.
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción de Botón de Envío**: ((Vigente)) El `Button` de envío con su lógica de estado `isLoading` es un patrón repetido. Podría ser abstraído a un componente `SubmitButton` genérico.
 *
 * =====================================================================
 */
// src/components/workspaces/InviteMemberForm.tsx
