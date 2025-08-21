// src/lib/hooks/use-workspace-inline-editor.ts
"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { updateWorkspaceNameAction } from "@/lib/actions/workspaces.actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { logger } from "@/lib/logging";

/**
 * @file use-workspace-inline-editor.ts
 * @description Hook Soberano para la edición en línea del nombre del workspace.
 *              Corregido para usar importaciones atómicas de Server Actions.
 * @author Raz Podestá
 * @version 2.0.0
 */
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

    startApiTransition(async () => {
      const result = await updateWorkspaceNameAction(
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
