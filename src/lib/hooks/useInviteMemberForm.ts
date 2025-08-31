// src/lib/hooks/useInviteMemberForm.ts
/**
 * @file useInviteMemberForm.ts
 * @description Hook Soberano que encapsula la lógica completa para el formulario
 *              de invitación de miembros. Gestiona el estado con `react-hook-form`,
 *              la validación con Zod, la mutación con Server Actions, y el
 *              feedback al usuario con `react-hot-toast`.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
"use client";

import { useTransition } from "react";
import {
  useForm,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { invitations as invitationActions } from "@/lib/actions";
import { clientLogger } from "@/lib/logging";
import { InvitationClientSchema, isActionError } from "@/lib/validators";

type FormData = z.infer<typeof InvitationClientSchema>;

interface UseInviteMemberFormProps {
  workspaceId: string;
  onSuccess: () => void;
}

interface UseInviteMemberFormReturn {
  form: UseFormReturn<FormData>;
  isLoading: boolean;
  processSubmit: SubmitHandler<FormData>;
  t: ReturnType<typeof useTranslations>;
  tErrors: ReturnType<typeof useTranslations>;
}

/**
 * @public
 * @function useInviteMemberForm
 * @description Hook Soberano que encapsula la lógica para el formulario de invitación.
 * @param {UseInviteMemberFormProps} props - Las dependencias del hook.
 * @returns {UseInviteMemberFormReturn} Un objeto con la instancia del formulario y la lógica.
 */
export function useInviteMemberForm({
  workspaceId,
  onSuccess,
}: UseInviteMemberFormProps): UseInviteMemberFormReturn {
  const t = useTranslations("components.workspaces.WorkspaceSwitcher");
  const tErrors = useTranslations("shared.ValidationErrors");
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
    clientLogger.trace("[useInviteMemberForm] Enviando invitación.", data);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("role", data.role);
      formData.append("workspaceId", data.workspaceId);

      const result =
        await invitationActions.sendWorkspaceInvitationAction(formData);

      if (result.success) {
        toast.success(
          tErrors(result.data.messageKey as any, result.data.messageArgs)
        );
        reset();
        onSuccess();
      } else if (isActionError(result)) {
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
// src/lib/hooks/useInviteMemberForm.ts
