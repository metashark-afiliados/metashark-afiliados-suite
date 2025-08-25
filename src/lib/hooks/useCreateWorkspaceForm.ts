// src/lib/hooks/useCreateWorkspaceForm.ts
/**
 * @file useCreateWorkspaceForm.ts
 * @description Hook Soberano que encapsula la lógica completa para el formulario
 *              de creación de workspaces. Gestiona el estado con `react-hook-form`,
 *              la validación con Zod, la mutación con Server Actions, y el
 *              feedback al usuario con `react-hot-toast`.
 * @author Raz Podestá - MetaShark Tech, Florianópolis/SC, Brazil, raz.metashark.tech
 * @version 3.0.2
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTransition } from "react";
import {
  useForm,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form"; // Import UseFormReturn
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
 * @interface UseCreateWorkspaceFormReturn
 * @description Define el contrato de tipo para el objeto retornado por el hook `useCreateWorkspaceForm`.
 */
interface UseCreateWorkspaceFormReturn {
  form: UseFormReturn<FormData>;
  isLoading: boolean;
  processSubmit: SubmitHandler<FormData>;
}

/**
 * @public
 * @function useCreateWorkspaceForm
 * @description Hook Soberano que encapsula la lógica completa para el formulario
 *              de creación de workspaces.
 * @param {UseCreateWorkspaceFormProps} props - Las dependencias del hook.
 * @returns {UseCreateWorkspaceFormReturn} Un objeto con la instancia del formulario, el estado de carga y el
 *          manejador de envío para ser consumidos por un componente de
 *          presentación puro.
 */
export function useCreateWorkspaceForm({
  onSuccess,
}: UseCreateWorkspaceFormProps): UseCreateWorkspaceFormReturn {
  // <--- CORRECCIÓN DE TIPO
  const t = useTranslations("WorkspaceSwitcher");
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
 * 1. **Resolución de Error Crítico (TS2353)**: ((Implementada)) Se ha corregido la declaración del tipo de retorno del hook `useCreateWorkspaceForm` para que sea `UseCreateWorkspaceFormReturn`, un objeto que coincide con las propiedades que realmente retorna. Esto resuelve el error de compilación.
 * 2. **Claridad y Cohesión de Tipos**: ((Implementada)) Se ha introducido una nueva interfaz `UseCreateWorkspaceFormReturn` para tipar explícitamente el valor devuelto por el hook, mejorando la legibilidad y mantenibilidad del contrato de API del hook.
 *
 * @subsection Melhorias Futuras
 * 1. **Callback de Error**: ((Vigente)) El hook podría aceptar un callback `onError` opcional para permitir al componente consumidor ejecutar lógica personalizada en caso de fallo, como mantener el modal abierto.
 *
 * =====================================================================
 */
