// src/lib/hooks/useWorkspaceManager.ts
/**
 * @file useWorkspaceManager.ts
 * @description Hook soberano y orquestador para la lógica del WorkspaceSwitcher.
 *              Refactorizado para exponer una API de callbacks explícita y semántica,
 *              resolviendo el error de contrato TS2739 en su consumidor.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
 * @see .docs-espejo/lib/hooks/useWorkspaceManager.ts.md
 */
"use client";

import { useCallback, useState, useTransition } from "react";
import toast from "react-hot-toast";

import { setActiveWorkspaceAction } from "@/lib/actions/workspaces.actions";
import {
  useWorkspaceDialogStore,
  type WorkspaceDialogType,
} from "@/lib/hooks/useWorkspaceDialogStore";
import { clientLogger } from "@/lib/logger";
import { useRouter } from "@/lib/navigation";

/**
 * @public
 * @function useWorkspaceManager
 * @description Hook soberano que provee toda la lógica de estado y los manejadores
 *              de eventos para el componente `WorkspaceSwitcher`.
 * @returns Un objeto con el estado del Popover, el estado de carga, y manejadores de acciones.
 */
export function useWorkspaceManager() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const openDialog = useWorkspaceDialogStore((state) => state.open);
  const router = useRouter();

  const closePopover = useCallback(() => setPopoverOpen(false), []);

  const handleAction = useCallback(
    (action: () => void) => {
      closePopover();
      // Delay para permitir que la animación de cierre del popover finalice antes de abrir un modal.
      setTimeout(action, 150);
    },
    [closePopover]
  );

  const handleWorkspaceSelect = useCallback(
    (workspaceId: string) => {
      clientLogger.trace(
        { workspaceId },
        "[useWorkspaceManager] Selección de workspace iniciada."
      );
      closePopover();
      startTransition(() => {
        // La Server Action se encarga de la redirección en caso de éxito.
        setActiveWorkspaceAction(workspaceId);
        // El toast de éxito podría moverse a la respuesta de la acción si se desea.
        toast.success("Workspace context changed.");
      });
    },
    [closePopover]
  );

  // --- INICIO DE REFACTORIZACIÓN: API de Callbacks Explícita ---
  const onSelectCreate = () => {
    clientLogger.trace(
      {},
      "[useWorkspaceManager] Comando 'Crear' seleccionado."
    );
    handleAction(() => openDialog("create"));
  };

  const onSelectInvite = () => {
    clientLogger.trace(
      {},
      "[useWorkspaceManager] Comando 'Invitar' seleccionado."
    );
    handleAction(() => openDialog("invite"));
  };

  const onSelectRename = () => {
    clientLogger.trace(
      {},
      "[useWorkspaceManager] Comando 'Renombrar' seleccionado."
    );
    handleAction(() => openDialog("rename"));
  };

  const onSelectSettings = () => {
    clientLogger.trace(
      {},
      "[useWorkspaceManager] Comando 'Ajustes' seleccionado."
    );
    handleAction(() => router.push("/dashboard/settings"));
  };

  const onSelectDelete = () => {
    clientLogger.trace(
      {},
      "[useWorkspaceManager] Comando 'Eliminar' seleccionado."
    );
    handleAction(() => openDialog("delete"));
  };
  // --- FIN DE REFACTORIZACIÓN ---

  return {
    popoverOpen,
    setPopoverOpen,
    isPending,
    handleWorkspaceSelect,
    onSelectCreate,
    onSelectInvite,
    onSelectRename,
    onSelectSettings,
    onSelectDelete,
  };
}
// src/lib/hooks/useWorkspaceManager.ts
