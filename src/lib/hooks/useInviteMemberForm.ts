// src/lib/hooks/useInviteMemberForm.ts
/**
 * @file useInviteMemberForm.ts
 * @description Hook soberano que encapsula la lógica completa para el formulario
 *              de invitación de miembros. Ha sido refactorizado holísticamente para
 *              consumir correctamente el contrato de feedback de la Server Action,
 *              utilizando `messageKey` y `messageArgs` para un feedback de
 *              usuario completamente internacionalizado y dinámico.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-29
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
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Invitaciones Múltiples**: El formulario y este hook podrían ser extendidos para aceptar un campo de texto de múltiples líneas (`<Textarea>`) donde el usuario pueda ingresar varios correos electrónicos a la vez, cada uno en una nueva línea, para invitar a miembros en lote.
 * 2. **Feedback de Invitación Pendiente**: En lugar de simplemente mostrar un toast de éxito, el hook podría devolver los datos de la invitación recién creada para que la UI pueda añadirla a una lista de "Invitaciones Pendientes" sin necesidad de una recarga completa.
 * 3. **Gestión de Foco**: Tras un envío exitoso, el foco podría ser devuelto programáticamente al botón que abrió el modal para una mejor accesibilidad y experiencia de usuario.
 * 4. **Tipado de Claves de Error**: La aserción `as any` en `tErrors` puede ser eliminada si el tipo `ActionResult` es refinado para que la propiedad `error` sea un genérico `TErrorKey extends keyof ValidationErrorsMessages`, proporcionando una seguridad de tipos aún mayor.
 * =====================================================================
 */
