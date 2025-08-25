// src/lib/hooks/useWorkspaceInlineEditor.ts
/**
 * @file useWorkspaceInlineEditor.ts
 * @description Hook Soberano de lógica pura para la edición en línea.
 *              Es 100% agnóstico a la i18n, recibiendo textos vía argumentos.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";

import { workspaces as workspaceActions } from "@/lib/actions";
import { useDashboard } from "@/lib/context/DashboardContext";

interface UseWorkspaceInlineEditorProps {
  successToastText: string;
  errorToastTextFn: (errorKey: string) => string;
}

export function useWorkspaceInlineEditor({
  successToastText,
  errorToastTextFn,
}: UseWorkspaceInlineEditorProps) {
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
      const result = await workspaceActions.updateWorkspaceNameAction(
        activeWorkspace.id,
        inputValue
      );

      if (result.success) {
        toast.success(successToastText);
      } else {
        toast.error(errorToastTextFn(result.error));
        setInputValue(activeWorkspaceName);
      }
      setIsEditing(false);
    });
  }, [
    activeWorkspace,
    inputValue,
    activeWorkspaceName,
    successToastText,
    errorToastTextFn,
  ]);

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
// src/lib/hooks/useWorkspaceInlineEditor.ts
