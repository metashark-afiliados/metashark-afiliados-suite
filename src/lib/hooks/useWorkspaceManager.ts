// src/lib/hooks/useWorkspaceManager.ts
/**
 * @file useWorkspaceManager.ts
 * @description Hook soberano y orquestador para la lógica del WorkspaceSwitcher.
 *              Sincronizado para proveer el callback `onSelectRename`.
 * @author Raz Podestá
 * @version 1.1.0
 */
"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { workspaces as workspaceActions } from "@/lib/actions";
import { useWorkspaceDialogStore } from "@/lib/hooks/useWorkspaceDialogStore";
import { logger } from "@/lib/logging";

export function useWorkspaceManager() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const openDialog = useWorkspaceDialogStore((state) => state.open);
  const router = useRouter();

  const closePopover = useCallback(() => setPopoverOpen(false), []);

  const handleWorkspaceSelect = useCallback(
    (workspaceId: string) => {
      logger.trace(`[useWorkspaceManager] Selección de workspace iniciada`, {
        workspaceId,
      });
      closePopover();
      startTransition(() => {
        workspaceActions.setActiveWorkspaceAction(workspaceId);
      });
    },
    [closePopover]
  );

  const handleCreate = useCallback(() => {
    closePopover();
    openDialog("create");
  }, [closePopover, openDialog]);

  const handleInvite = useCallback(() => {
    closePopover();
    openDialog("invite");
  }, [closePopover, openDialog]);

  // --- INICIO DE CORRECCIÓN ---
  const handleRename = useCallback(() => {
    closePopover();
    openDialog("rename" as any); // TODO: Añadir 'rename' al tipo WorkspaceDialogType
  }, [closePopover, openDialog]);
  // --- FIN DE CORRECCIÓN ---

  const handleSettings = useCallback(() => {
    closePopover();
    router.push("/dashboard/settings/workspace");
  }, [closePopover, router]);

  const handleDelete = useCallback(() => {
    closePopover();
    openDialog("delete");
  }, [closePopover, openDialog]);

  return {
    popoverOpen,
    setPopoverOpen,
    isPending,
    handleWorkspaceSelect,
    onSelectCreate: handleCreate,
    onSelectInvite: handleInvite,
    onSelectRename: handleRename, // <-- Exportación añadida
    onSelectSettings: handleSettings,
    onSelectDelete: handleDelete,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato**: ((Implementada)) El hook ahora exporta `onSelectRename`, resolviendo el error `TS2339`.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado de Diálogo**: ((Vigente)) El tipo `WorkspaceDialogType` en `useWorkspaceDialogStore` debe ser actualizado para incluir `"rename"`.
 *
 * =====================================================================
 */
// src/lib/hooks/useWorkspaceManager.ts
