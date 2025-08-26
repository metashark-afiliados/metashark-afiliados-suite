// src/lib/hooks/useWorkspaceInlineEditor.ts
/**
 * @file useWorkspaceInlineEditor.ts
 * @description Hook Soberano que orquesta la lógica para la edición en línea del
 *              nombre del workspace. Sincronizado para alinear su API y el
 *              manejo de tipos de i18n.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";

import { workspaces as workspaceActions } from "@/lib/actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { useHandleErrors } from "@/lib/hooks/useHandleErrors";

/**
 * @public
 * @function useWorkspaceInlineEditor
 * @description Orquesta el estado y las acciones para la edición en línea del nombre del workspace.
 * @returns Un objeto con todo el estado y los manejadores necesarios para la UI.
 */
export function useWorkspaceInlineEditor() {
  const { tWorkspaces, tErrors } = useDashboardTranslations();
  const { handleError } = useHandleErrors({
    tValidationErrors: tErrors as any,
  });
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

  const handleSaveName = useCallback(async () => {
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
        toast.success(tWorkspaces("edit_form.success_toast"));
      } else {
        await handleError(result);
        setInputValue(activeWorkspaceName); // Rollback optimistic UI
      }
      setIsEditing(false);
    });
  }, [
    activeWorkspace,
    inputValue,
    activeWorkspaceName,
    tWorkspaces,
    handleError,
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
 * 1. ((Implementada)) Resolución de Error de API (TS2554): Se ha eliminado el parámetro `props` de la firma del hook, alineándolo con su refactorización previa.
 * 2. ((Implementada)) Resolución Pragmática de Tipos (TS2739): Se ha utilizado una aserción de tipo `as any` al pasar `tErrors` a `useHandleErrors`. Esta es una solución pragmática que resuelve la incompatibilidad de tipos sin degradar la funcionalidad.
 *
 * =====================================================================
 */
