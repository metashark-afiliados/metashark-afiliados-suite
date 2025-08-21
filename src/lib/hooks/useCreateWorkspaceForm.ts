// src/lib/hooks/useCreateWorkspaceForm.ts
/**
 * @file useCreateWorkspaceForm.ts
 * @description Hook Soberano que encapsula la lógica completa para el formulario
 *              de creación de workspaces. Gestiona el estado con `react-hook-form`,
 *              la validación con Zod, la mutación con Server Actions, y el
 *              feedback al usuario con `react-hot-toast`.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { workspaces as workspaceActions } from "@/lib/actions";
import { clientLogger } from "@/lib/logging";
import { CreateWorkspaceSchema } from "@/lib/validators";

type FormData = z.infer<typeof CreateWorkspaceSchema>;

/**
 * @public
 * @interface UseCreateWorkspaceFormProps
 * @description Contrato de props para el hook.
 */
interface UseCreateWorkspaceFormProps {
  /**
   * Callback que se ejecuta después de una creación exitosa.
   * Usualmente se utiliza para cerrar el modal que contiene el formulario.
   */
  onSuccess: () => void;
}

/**
 * @public
 * @function useCreateWorkspaceForm
 * @description Orquesta toda la lógica para el formulario de creación de workspaces.
 * @param {UseCreateWorkspaceFormProps} props - Las dependencias del hook.
 * @returns Un objeto con el estado y los manejadores para ser consumidos por un
 *          componente de presentación puro.
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

      const result = await workspaceActions.createWorkspaceAction(formData);

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
 * 1. **Atomicidad Radical (Lógica)**: ((Implementada)) Este hook aísla completamente la lógica del formulario, adhiriéndose al Principio de Responsabilidad Única y a la "Filosofía LEGO".
 * 2. **Formulario Soberano**: ((Implementada)) Actúa como el "cerebro" del formulario, gestionando el estado, la validación y la comunicación con el servidor.
 * 3. **Full Observabilidad**: ((Implementada)) Las acciones clave son registradas con `clientLogger` para una depuración y monitoreo efectivos.
 *
 * @subsection Melhorias Futuras
 * 1. **Callback de Error**: ((Vigente)) El hook podría aceptar un callback `onError` opcional para permitir al componente consumidor ejecutar lógica personalizada en caso de fallo.
 * 2. **Valores Iniciales Dinámicos**: ((Vigente)) Podría aceptar un objeto `initialValues` para pre-poblar el formulario, útil para futuros flujos de "clonar workspace".
 *
 * =====================================================================
 */
// src/lib/hooks/useCreateWorkspaceForm.ts
