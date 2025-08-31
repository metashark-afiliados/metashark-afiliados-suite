// src/lib/hooks/useWorkspaceManager.ts
/**
 * @file useWorkspaceManager.ts
 * @description Hook soberano y orquestador para la lógica del WorkspaceSwitcher.
 *              Ha sido refactorizado a un estándar de élite para consumir la SSoT
 *              de navegación y unificar su nomenclatura interna.
 * @author Raz Podestá
 * @version 2.1.0
 */
"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "@/lib/navigation"; // <-- CORRECCIÓN: Usar SSoT de navegación

import { setActiveWorkspaceAction } from "@/lib/actions/workspaces.actions";
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
        setActiveWorkspaceAction(workspaceId);
      });
    },
    [closePopover]
  );

  const handleAction = useCallback(
    (action: () => void) => {
      closePopover();
      action();
    },
    [closePopover]
  );

  return {
    popoverOpen,
    setPopoverOpen,
    isPending,
    handleWorkspaceSelect,
    onSelectCreate: () => handleAction(() => openDialog("create")),
    onSelectInvite: () => handleAction(() => openDialog("invite")),
    onSelectRename: () => handleAction(() => openDialog("rename")),
    onSelectSettings: () =>
      handleAction(() => router.push("/dashboard/settings")),
    onSelectDelete: () => handleAction(() => openDialog("delete")),
  };
}
