// src/lib/hooks/useCreateWorkspaceForm.ts
"use client";

import { useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { createWorkspaceAction } from "@/lib/actions/workspaces.actions";
import { clientLogger } from "@/lib/logging";
import { CreateWorkspaceSchema } from "@/lib/validators";

type FormData = z.infer<typeof CreateWorkspaceSchema>;

/**
 * @public
 * @interface UseCreateWorkspaceFormProps
 * @description Define el contrato de props para el hook `useCreateWorkspaceForm`.
 */
interface UseCreateWorkspaceFormProps {
  /**
   * @property onSuccess
   * @description Callback que se ejecuta después de una creación exitosa.
   *              Usualmente se utiliza para cerrar el modal que contiene el formulario.
   */
  onSuccess: () => void;
}

/**
 * @public
 * @function useCreateWorkspaceForm
 * @description Hook Soberano que encapsula la lógica completa para el formulario
 *              de creación de workspaces. Gestiona el estado con `react-hook-form`,
 *              la validación con Zod, la mutación con Server Actions, y el
 *              feedback al usuario con `react-hot-toast`.
 * @param {UseCreateWorkspaceFormProps} props - Las dependencias del hook.
 * @returns Un objeto con la instancia del formulario, el estado de carga y el
 *          manejador de envío para ser consumidos por un componente de
 *          presentación puro.
 * @version 2.0.0
 * @author Raz Podestá
 */
export function useCreateWorkspaceForm({
  onSuccess,
}: UseCreateWorkspaceFormProps) {
  const t = useTranslations("WorkspaceSwitcher");
  const tErrors = useTranslations("ValidationErrors");
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

      const result = await createWorkspaceAction(formData);

      if (result.success) {
        toast.success(t("create_form.success_toast"));
        clientLogger.info(
          "[useCreateWorkspaceForm] Workspace creado con éxito.",
          {
            workspaceId: result.data.id,
          }
        );
        onSuccess();
      } else {
        toast.error(
          tErrors(result.error as any, { defaultValue: result.error })
        );
        clientLogger.error(
          "[useCreateWorkspaceForm] Fallo al crear workspace.",
          {
            error: result.error,
          }
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Build**: ((Implementada)) Se ha reemplazado la importación del barril de acciones por una importación atómica, resolviendo una futura causa de fallo de compilación "server-only".
 * 2. **Documentación TSDoc Completa**: ((Implementada)) Se ha añadido documentación TSDoc verbosa y precisa a todas las partes del hook, mejorando la claridad y mantenibilidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Callback de Error**: ((Vigente)) El hook podría aceptar un callback `onError` opcional para permitir al componente consumidor ejecutar lógica personalizada en caso de fallo.
 *
 * =====================================================================
 */
