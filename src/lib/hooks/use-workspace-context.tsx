// src/lib/hooks/use-workspace-context.tsx
/**
 * @file src/lib/hooks/use-workspace-context.tsx
 * @description Hook Soberano y Proveedor de Contexto para la UI de gestión de workspaces.
 *              Ha sido nivelado a la Arquitectura v9.2 para consumir el rol del
 *              usuario y exponer flags de permisos booleanos (`canEdit`, `canDelete`),
 *              abstraendo la lógica de autorización de la UI de presentación.
 * @author Raz Podestá
 * @version 1.2.0
 */
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { workspaces as workspaceActions } from "@/lib/actions";
import { useDashboard } from "@/lib/context/DashboardContext";

interface WorkspaceContextType {
  // Estado
  popoverOpen: boolean;
  createDialogOpen: boolean;
  inviteDialogOpen: boolean;
  deleteDialogOpen: boolean;
  isEditing: boolean;
  inputValue: string;
  isApiPending: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  // Flags de Permisos
  canEdit: boolean; // <-- NUEVO
  canDelete: boolean; // <-- NUEVO
  // Setters
  setPopoverOpen: (open: boolean) => void;
  setCreateDialogOpen: (open: boolean) => void;
  setInviteDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setIsEditing: (editing: boolean) => void;
  setInputValue: (value: string) => void;
  // Handlers
  handleSaveName: () => void;
  handleWorkspaceSelect: (workspaceId: string) => void;
  handleDeleteWorkspace: (formData: FormData) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("WorkspaceSwitcher");
  const t_errors = useTranslations("ValidationErrors");
  const { activeWorkspace, activeWorkspaceRole } = useDashboard();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(activeWorkspace?.name || "");
  const [isApiPending, startApiTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // --- LÓGICA DE PERMISOS DE ÉLITE ---
  const { canEdit, canDelete } = useMemo(() => {
    const role = activeWorkspaceRole;
    return {
      canEdit: role === "owner" || role === "admin",
      canDelete: role === "owner",
    };
  }, [activeWorkspaceRole]);
  // --- FIN DE LÓGICA DE PERMISOS ---

  useEffect(() => {
    if (activeWorkspace) {
      setInputValue(activeWorkspace.name);
    }
  }, [activeWorkspace]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSaveName = useCallback(() => {
    if (!activeWorkspace || inputValue.trim() === activeWorkspace.name) {
      setIsEditing(false);
      return;
    }
    startApiTransition(async () => {
      const result = await workspaceActions.updateWorkspaceNameAction(
        activeWorkspace.id,
        inputValue
      );
      if (result.success) {
        toast.success(t("edit_form.success_toast"));
      } else {
        toast.error(t_errors(result.error as any));
        setInputValue(activeWorkspace.name);
      }
      setIsEditing(false);
    });
  }, [activeWorkspace, inputValue, t, t_errors]);

  const handleWorkspaceSelect = useCallback((workspaceId: string) => {
    startApiTransition(() => {
      workspaceActions.setActiveWorkspaceAction(workspaceId);
    });
    setPopoverOpen(false);
  }, []);

  const handleDeleteWorkspace = useCallback(
    (formData: FormData) => {
      startApiTransition(async () => {
        const result = await workspaceActions.deleteWorkspaceAction(formData);
        if (result.success) {
          toast.success(t("delete_dialog.success_toast"));
        } else {
          toast.error(t_errors(result.error as any));
        }
        setDeleteDialogOpen(false);
      });
    },
    [t, t_errors]
  );

  const value = {
    popoverOpen,
    createDialogOpen,
    inviteDialogOpen,
    deleteDialogOpen,
    isEditing,
    inputValue,
    isApiPending,
    inputRef,
    canEdit,
    canDelete,
    setPopoverOpen,
    setCreateDialogOpen,
    setInviteDialogOpen,
    setDeleteDialogOpen,
    setIsEditing,
    setInputValue,
    handleSaveName,
    handleWorkspaceSelect,
    handleDeleteWorkspace,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspaceContext = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error(
      "useWorkspaceContext debe ser usado dentro de un WorkspaceProvider"
    );
  }
  return context;
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Abstracción de Permisos**: ((Implementada)) El hook ahora consume `activeWorkspaceRole` y expone flags booleanos `canEdit` y `canDelete`. Esto abstrae la lógica de negocio de los componentes de presentación, que ahora solo necesitan consumir un booleano.
 * 2. **Optimización con `useMemo`**: ((Implementada)) La derivación de los flags de permisos está envuelta en `useMemo`, asegurando que esta lógica solo se re-calcule cuando el rol del usuario cambie.
 *
 * =====================================================================
 */
// src/lib/hooks/use-workspace-context.tsx
