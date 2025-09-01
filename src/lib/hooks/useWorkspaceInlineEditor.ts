// src/lib/hooks/useWorkspaceInlineEditor.ts
/**
 * @file useWorkspaceInlineEditor.ts
 * @description Hook Soberano para la edición en línea. Sincronizado con la
 *              arquitectura "Lean Database", consumiendo `role_id` y el
 *              manifiesto de roles.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 7.0.0
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
import { UpdateWorkspaceNameSchema, isActionError } from "@/lib/validators";
import { WORKSPACE_ROLES } from "@/config/roles.config";

type FormData = z.infer<typeof UpdateWorkspaceNameSchema>;

export function useWorkspaceInlineEditor() {
  const t = useTranslations("components.workspaces.WorkspaceSwitcher");
  const tErrors = useTranslations("shared.ValidationErrors");
  const { activeWorkspace, activeWorkspaceRoleId } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const [isApiPending, startApiTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(UpdateWorkspaceNameSchema),
    defaultValues: { name: activeWorkspace?.name || "" },
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

  const canEdit =
    activeWorkspaceRoleId === WORKSPACE_ROLES.OWNER.id ||
    activeWorkspaceRoleId === WORKSPACE_ROLES.ADMIN.id;

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
        } else if (isActionError(result)) {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
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
    canEdit,
    activeWorkspaceName,
    form,
    handleBlur,
    handleKeyDown,
  };
}
// src/lib/hooks/useWorkspaceInlineEditor.ts
