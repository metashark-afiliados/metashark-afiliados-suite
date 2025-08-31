// src/lib/hooks/useCreateWorkspaceForm.ts
/**
 * @file useCreateWorkspaceForm.ts
 * @description Hook Soberano que encapsula la lógica para el formulario
 *              de creación de workspaces. Ha sido refactorizado para adherirse
 *              estrictamente al SRP, ya no exporta funciones de traducción.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 3.1.0
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

import { workspaces as workspaceActions } from "@/lib/actions";
import { clientLogger } from "@/lib/logging";
import { CreateWorkspaceSchema, isActionError } from "@/lib/validators";

type FormData = z.infer<typeof CreateWorkspaceSchema>;

interface UseCreateWorkspaceFormProps {
  onSuccess: () => void;
}

interface UseCreateWorkspaceFormReturn {
  form: UseFormReturn<FormData>;
  isLoading: boolean;
  processSubmit: SubmitHandler<FormData>;
}

/**
 * @public
 * @function useCreateWorkspaceForm
 * @description Hook Soberano que encapsula la lógica para el formulario de creación.
 * @param {UseCreateWorkspaceFormProps} props - Las dependencias del hook.
 * @returns {UseCreateWorkspaceFormReturn} Un objeto con la instancia del formulario y la lógica.
 */
export function useCreateWorkspaceForm({
  onSuccess,
}: UseCreateWorkspaceFormProps): UseCreateWorkspaceFormReturn {
  const t = useTranslations("components.workspaces.WorkspaceSwitcher");
  const tErrors = useTranslations("shared.ValidationErrors");
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(CreateWorkspaceSchema),
    defaultValues: {
      workspaceName: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const processSubmit: SubmitHandler<FormData> = (data) => {
    clientLogger.trace("[useCreateWorkspaceForm] Enviando nuevo workspace.", {
      workspaceName: data.workspaceName,
    });

    startTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceName", data.workspaceName);

      const result = await workspaceActions.createWorkspaceAction(formData);

      if (result.success) {
        toast.success(t("create_form.success_toast"));
        clientLogger.info(
          "[useCreateWorkspaceForm] Workspace creado con éxito.",
          { workspaceId: result.data.id }
        );
        onSuccess();
      } else if (isActionError(result)) {
        toast.error(
          tErrors(result.error as any, { defaultValue: result.error })
        );
        clientLogger.error(
          "[useCreateWorkspaceForm] Fallo al crear workspace.",
          { error: result.error }
        );
      }
    });
  };

  const isLoading = isSubmitting || isPending;

  return {
    form,
    isLoading,
    processSubmit,
  };
}
// src/lib/hooks/useCreateWorkspaceForm.ts
