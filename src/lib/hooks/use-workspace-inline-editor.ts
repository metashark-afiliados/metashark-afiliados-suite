// src/lib/hooks/use-workspace-inline-editor.ts
/**
 * @file use-workspace-inline-editor.ts
 * @description Hook Soberano que encapsula la lógica de estado y negocio
 *              para la edición en línea del nombre del workspace.
 * @author Raz Podestá
 * @version 1.0.2 (Naming Reverted)
 */
"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { workspaces as workspaceActions } from "@/lib/actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { logger } from "@/lib/logging";

export function useWorkspaceInlineEditor() {
  const t = useTranslations("WorkspaceSwitcher");
  const tErrors = useTranslations("ValidationErrors");
  const { activeWorkspace, activeWorkspaceRole } = useDashboard();

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(activeWorkspace?.name || "");
  const [isApiPending, startApiTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const canEdit =
    activeWorkspaceRole === "owner" || activeWorkspaceRole === "admin";
  const activeWorkspaceName = activeWorkspace?.name || "";

  useEffect(() => {
    if (activeWorkspace) {
      setInputValue(activeWorkspace.name);
    }
  }, [activeWorkspace]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveName = useCallback(() => {
    if (
      !activeWorkspace ||
      inputValue.trim() === "" ||
      inputValue.trim() === activeWorkspaceName
    ) {
      setIsEditing(false);
      setInputValue(activeWorkspaceName);
      return;
    }

    logger.trace(
      `[useWorkspaceInlineEditor] Guardando nuevo nombre para workspace: ${activeWorkspace.id}`
    );

    startApiTransition(async () => {
      const result = await workspaceActions.updateWorkspaceNameAction(
        activeWorkspace.id,
        inputValue
      );

      if (result.success) {
        toast.success(t("edit_form.success_toast"));
      } else {
        toast.error(
          tErrors(result.error as any, { defaultValue: result.error })
        );
        setInputValue(activeWorkspaceName);
      }
      setIsEditing(false);
    });
  }, [activeWorkspace, inputValue, activeWorkspaceName, t, tErrors]);

  return {
    isEditing,
    setIsEditing,
    inputValue,
    setInputValue,
    isApiPending,
    inputRef,
    canEdit,
    handleSaveName,
    activeWorkspaceName,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Consistencia de Nomenclatura (Revertida)**: ((Implementada)) Se ha revertido el nombre del archivo a `kebab-case` para mantener la coherencia con el snapshot original.
 *
 * =====================================================================
 */
// src/lib/hooks/use-workspace-inline-editor.ts
