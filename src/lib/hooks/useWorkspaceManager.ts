// src/lib/hooks/useWorkspaceManager.ts
/**
 * @file useWorkspaceManager.ts
 * @description Hook soberano y orquestador para la lógica del WorkspaceSwitcher.
 *              Ha sido refactorizado a un estándar de élite para utilizar importaciones
 *              atómicas de Server Actions, resolviendo un error de build crítico.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

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

  const handleCreate = useCallback(() => {
    closePopover();
    openDialog("create");
  }, [closePopover, openDialog]);

  const handleInvite = useCallback(() => {
    closePopover();
    openDialog("invite");
  }, [closePopover, openDialog]);

  const handleRename = useCallback(() => {
    closePopover();
    openDialog("rename");
  }, [closePopover, openDialog]);

  const handleSettings = useCallback(() => {
    closePopover();
    // La navegación a una ruta estática no requiere `useRouter` de `next-intl`
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
    onSelectRename: handleRename,
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
 * 1. **Resolución de Error de Build**: ((Implementada)) Se ha reemplazado `import { workspaces }` por una importación atómica de `setActiveWorkspaceAction`. Esto desacopla el hook del barrel file `server-only`, resolviendo la causa del fallo de compilación.
 * 2. **Simplificación de Dependencias**: ((Implementada)) El hook es ahora más modular y tiene dependencias más explícitas, mejorando la mantenibilidad.
 *
 * =====================================================================
 */
