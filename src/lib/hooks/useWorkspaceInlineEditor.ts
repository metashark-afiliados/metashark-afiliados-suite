// src/lib/hooks/useWorkspaceInlineEditor.ts
/**
 * @file useWorkspaceInlineEditor.ts
 * @description Hook Soberano que encapsula toda la lógica de estado para la
 *              edición en línea del nombre del workspace. Ha sido refactorizado
 *              a un estándar de élite para ser 100% agnóstico a la i18n,
 *              recibiendo sus textos de feedback como dependencias inyectadas.
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

/**
 * @public
 * @function useWorkspaceInlineEditor
 * @description Orquesta el estado y las acciones para la edición en línea del nombre del workspace.
 * @param {UseWorkspaceInlineEditorProps} props - Dependencias del hook, incluyendo textos para toasts.
 * @returns Un objeto con todo el estado y los manejadores necesarios para la UI.
 */
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Pureza de Lógica (Agnóstico a i18n)**: ((Implementada)) Se han eliminado las llamadas a `useTranslations`. El hook ahora es una pieza de lógica pura que recibe sus dependencias de texto, cumpliendo con el Manifiesto IMAS.
 * 2. **Resolución Preventiva de `MISSING_MESSAGE`**: ((Implementada)) Al no cargar su propio namespace, este hook ya no puede ser la fuente del error. La responsabilidad se transfiere correctamente al consumidor del hook.
 *
 * @subsection Melhorias Futuras
 * 1. **Rollback Optimista**: ((Vigente)) En caso de error, el estado se revierte (`setInputValue(activeWorkspaceName)`). Esta lógica podría ser más robusta si se almacena el valor original en una variable de estado al iniciar la edición.
 *
 * =====================================================================
 */
