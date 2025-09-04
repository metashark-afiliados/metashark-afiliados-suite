// src/lib/hooks/useWorkspaceInlineEditor.ts
/**
 * @file useWorkspaceInlineEditor.ts
 * @description Hook Soberano para la edición en línea del nombre del workspace.
 *              Refactorizado a un estándar de élite para pagar la deuda técnica de
 *              "Fuga de Abstracción", utilizando `role_id` para la lógica de permisos
 *              y cumpliendo con la Directiva 4 de la Constitución.
 * @author RaZ Podestá - MetaShark Tech
 * @version 8.0.0
 * @see .docs/debt/001_LEAN_DB_ABSTRACTION_LEAK.md
 * @see .docs-espejo/lib/hooks/useWorkspaceInlineEditor.ts.md
 */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import type { z } from "zod";

import { updateWorkspaceNameAction } from "@/lib/actions/workspaces.actions";
import { WORKSPACE_ROLES } from "@/config/roles.config";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logger";
import { isActionError, UpdateWorkspaceNameSchema } from "@/lib/validators";

type FormData = z.infer<typeof UpdateWorkspaceNameSchema>;

/**
 * @public
 * @function useWorkspaceInlineEditor
 * @description Hook soberano que provee toda la lógica y estado necesarios para
 *              la edición en línea del nombre del workspace.
 * @returns Un objeto con el estado computado y los manejadores de eventos.
 */
export function useWorkspaceInlineEditor() {
  const t = useTypedTranslations("components.workspaces.WorkspaceSwitcher");
  const tErrors = useTypedTranslations("shared.ValidationErrors");
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
    if (activeWorkspace) reset({ name: activeWorkspace.name });
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
      clientLogger.info(
        { newName: data.name, workspaceId: activeWorkspace.id },
        "[useWorkspaceInlineEditor] Guardando nuevo nombre."
      );
      startApiTransition(async () => {
        const result = await updateWorkspaceNameAction(
          activeWorkspace.id,
          data.name
        );
        if (isActionError(result)) {
          toast.error(tErrors(result.error, { defaultValue: result.error }));
          reset({ name: activeWorkspaceName });
        } else {
          toast.success(t("edit_form.success_toast"));
        }
        setIsEditing(false);
      });
    },
    [activeWorkspace, activeWorkspaceName, t, tErrors, reset]
  );

  const handleBlur = () => handleSubmit(processSubmit)();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(processSubmit)();
    } else if (e.key === "Escape") {
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
