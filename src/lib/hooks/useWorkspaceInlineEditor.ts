// src/lib/hooks/useWorkspaceInlineEditor.ts
/**
 * @file useWorkspaceInlineEditor.ts
 * @description Hook Soberano para la edición en línea. Ha sido refactorizado para
 *              utilizar `react-hook-form`, proporcionando una API compatible
 *              con el nuevo componente de campo de formulario atómico.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 6.0.0
 */
"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { updateWorkspaceNameAction } from "@/lib/actions/workspaces.actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { UpdateWorkspaceNameSchema } from "@/lib/validators";

type FormData = z.infer<typeof UpdateWorkspaceNameSchema>;

/**
 * @public
 * @function useWorkspaceInlineEditor
 * @description Orquesta el estado y las acciones para la edición en línea.
 * @returns Un objeto con la instancia del formulario y la lógica para la UI.
 */
export function useWorkspaceInlineEditor() {
  const t = useTranslations("components.workspaces.WorkspaceSwitcher");
  const tErrors = useTranslations("shared.ValidationErrors");
  const { activeWorkspace, activeWorkspaceRole } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const [isApiPending, startApiTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(UpdateWorkspaceNameSchema),
    defaultValues: {
      name: activeWorkspace?.name || "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const activeWorkspaceName = activeWorkspace?.name || "";

  useEffect(() => {
    if (activeWorkspace) {
      reset({ name: activeWorkspace.name });
    }
  }, [activeWorkspace, reset]);

  const processSubmit: SubmitHandler<FormData> = useCallback(
    (data) => {
      if (!activeWorkspace || data.name.trim() === activeWorkspaceName) {
        setIsEditing(false);
        reset({ name: activeWorkspaceName });
        return;
      }

      startApiTransition(async () => {
        const result = await updateWorkspaceNameAction(
          activeWorkspace.id,
          data.name
        );

        if (result.success) {
          toast.success(t("edit_form.success_toast"));
        } else {
          toast.error(
            tErrors(result.error as any, { defaultValue: result.error })
          );
          reset({ name: activeWorkspaceName });
        }
        setIsEditing(false);
      });
    },
    [activeWorkspace, activeWorkspaceName, t, tErrors, reset]
  );

  const handleBlur = () => {
    handleSubmit(processSubmit)();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(processSubmit)();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      reset({ name: activeWorkspaceName });
    }
  };

  return {
    isEditing,
    setIsEditing,
    isApiPending: isApiPending || isSubmitting,
    canEdit: activeWorkspaceRole === "owner" || activeWorkspaceRole === "admin",
    activeWorkspaceName,
    form,
    handleBlur,
    handleKeyDown,
  };
}
// src/lib/hooks/useWorkspaceInlineEditor.ts
