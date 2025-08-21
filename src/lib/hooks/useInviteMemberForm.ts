// src/lib/hooks/useInviteMemberForm.ts
import { useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { invitations as invitationActions } from "@/lib/actions";
import { clientLogger } from "@/lib/logging";
import { InvitationClientSchema } from "@/lib/validators";

type FormData = z.infer<typeof InvitationClientSchema>;

interface UseInviteMemberFormProps {
  workspaceId: string;
  onSuccess: () => void;
}

/**
 * @public
 * @function useInviteMemberForm
 * @description Hook soberano que encapsula toda la lógica de estado y negocio para el
 *              formulario de invitación de miembros.
 * @param {UseInviteMemberFormProps} props - Las dependencias del hook.
 * @returns Un objeto con el estado del formulario, manejadores y callbacks para la UI.
 */
export function useInviteMemberForm({
  workspaceId,
  onSuccess,
}: UseInviteMemberFormProps) {
  const t = useTranslations("WorkspaceSwitcher");
  const tErrors = useTranslations("ValidationErrors");
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(InvitationClientSchema),
    defaultValues: {
      workspaceId,
      role: "member",
      email: "",
    },
  });

  const {
    formState: { isSubmitting },
    reset,
  } = form;

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

  return {
    form,
    isLoading,
    processSubmit,
    t,
    tErrors,
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Lógica de UI Aislada**: ((Implementada)) Este hook aísla completamente la lógica del formulario, cumpliendo con el SRP y la "Filosofía LEGO".
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Estado Offline**: ((Vigente)) El hook podría ser mejorado para encolar la acción si el usuario está offline y ejecutarla automáticamente al recuperar la conexión.
 *
 * =====================================================================
 */
// src/lib/hooks/useInviteMemberForm.ts
