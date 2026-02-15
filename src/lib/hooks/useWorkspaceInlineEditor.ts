// src/lib/hooks/useWorkspaceInlineEditor.ts
/**
 * @file useWorkspaceInlineEditor.ts
 * @description Hook soberano que encapsula la lógica completa para la edición en línea
 *              del nombre del workspace. Gestiona el estado de edición, el valor del input,
 *              la invocación de la server action y el feedback al usuario.
 * @author Raz Podestá - MetaShark Tech, Florianópolis/SC, Brazil, raz.metashark.tech
 * @version 2.0.1
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { workspaces as workspaceActions } from "@/lib/actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @function useWorkspaceInlineEditor
 * @description Hook soberano que encapsula la lógica completa para la edición en línea
 *              del nombre del workspace. Gestiona el estado de edición, el valor del input,
 *              la invocación de la server action y el feedback al usuario.
 * @returns Un objeto con el estado y los manejadores necesarios para el componente `WorkspaceTrigger`.
 */
export function useWorkspaceInlineEditor() {
  const t = useTranslations("WorkspaceSwitcher");
  // --- INICIO DE REFACTORIZACIÓN: Namespace Canónico ---
  const tErrors = useTranslations("shared.ValidationErrors");
  // --- FIN DE REFACTORIZACIÓN ---
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
    if (!activeWorkspace || inputValue.trim() === activeWorkspaceName) {
      setIsEditing(false);
      return;
    }

    clientLogger.trace(
      `[WorkspaceInlineEditor] Guardando nuevo nombre para workspace: ${activeWorkspace.id}`
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
 * 1. **Resolución de `MISSING_MESSAGE`**: ((Implementada)) Se ha corregido el namespace de `useTranslations` a `"shared.ValidationErrors"`. Esta es una corrección de élite que resuelve la causa raíz de los errores `MISSING_MESSAGE` para este namespace, alineando el hook con la arquitectura IMAS y los schemas de Zod.
 *
 * @subsection Melhorias Futuras
 * 1. **Prevención de Guardado Innecesario**: ((Vigente)) La lógica ya previene la llamada a la API si el nombre no ha cambiado, pero se podría añadir un feedback visual sutil al usuario en `handleSaveName` para indicar que no se realizaron cambios.
 *
 * =====================================================================
 */
