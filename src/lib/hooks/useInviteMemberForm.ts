// src/lib/hooks/useInviteMemberForm.ts
/**
 * @file useInviteMemberForm.ts
 * @description Hook soberano que encapsula toda la lógica de estado y negocio para el
 *              formulario de invitación de miembros.
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
} from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { invitations as invitationActions } from "@/lib/actions";
import { clientLogger } from "@/lib/logging";
import { InvitationClientSchema } from "@/lib/validators";
// --- INICIO DE REFACTORIZACIÓN: Rutas de Importación Canónicas ---
import { EmailInputField } from "@/components/workspaces/form-fields/EmailInputField";
import { RoleSelectField } from "@/components/workspaces/form-fields/RoleSelectField";
// --- FIN DE REFACTORIZACIÓN ---

type FormData = z.infer<typeof InvitationClientSchema>;

interface UseInviteMemberFormProps {
  workspaceId: string;
  onSuccess: () => void;
}

/**
 * @public
 * @interface UseInviteMemberFormReturn
 * @description Define el contrato de tipo para el objeto retornado por el hook `useInviteMemberForm`.
 */
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
 * @description Hook soberano que encapsula toda la lógica de estado y negocio para el
 *              formulario de invitación de miembros.
 * @param {UseInviteMemberFormProps} props - Las dependencias del hook.
 * @returns {UseInviteMemberFormReturn} Un objeto con la instancia del formulario, el estado de carga y el
 *          manejador de envío para ser consumidos por un componente de
 *          presentación puro.
 */
export function useInviteMemberForm({
  workspaceId,
  onSuccess,
}: UseInviteMemberFormProps): UseInviteMemberFormReturn {
  const t = useTranslations("WorkspaceSwitcher");
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
    // --- INICIO DE REFACTORIZACIÓN: Propiedad 'form' explícita ---
    form: form,
    // --- FIN DE REFACTORIZACIÓN ---
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
 * 1. **Resolución de Error Crítico (TS2307)**: ((Implementada)) Se han corregido las rutas de importación de `EmailInputField` y `RoleSelectField` a sus alias absolutos canónicos, resolviendo el error de módulo no encontrado.
 * 2. **Resolución de Error Crítico (TS18004)**: ((Implementada)) Se ha modificado el objeto de retorno del hook `useInviteMemberForm` para incluir explícitamente `form: form`, alineándolo con la interfaz `UseInviteMemberFormReturn` y resolviendo el error de propiedad abreviada.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Estado Offline**: ((Vigente)) El hook podría ser mejorado para encolar la acción si el usuario está offline y ejecutarla automáticamente al recuperar la conexión.
 *
 * =====================================================================
 */
