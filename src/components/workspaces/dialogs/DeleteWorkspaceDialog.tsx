// src/components/workspaces/dialogs/DeleteWorkspaceDialog.tsx
"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { ShieldAlert } from "lucide-react";

import { workspaces as workspaceActions } from "@/lib/actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useWorkspaceDialogStore } from "@/lib/hooks/useWorkspaceDialogStore";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmationDialogContent } from "@/components/ui/ConfirmationDialog";

/**
 * @file DeleteWorkspaceDialog.tsx
 * @description Componente de UI que implementa el modal para la eliminación de un workspace.
 *              Refactorizado para ser un consumidor de élite del `ConfirmationDialogContent` v3.0.0.
 * @author Raz Podestá
 * @version 4.0.0
 */
export function DeleteWorkspaceDialog(): React.ReactElement | null {
  const t = useTranslations("WorkspaceSwitcher");
  const tDialogs = useTranslations("Dialogs");
  const tErrors = useTranslations("ValidationErrors");
  const { activeDialog, close } = useWorkspaceDialogStore();
  const { activeWorkspace } = useDashboard();

  if (!activeWorkspace) return null;

  const handleDelete = (formData: FormData) => {
    // La Server Action se invoca desde el `ConfirmationDialogContent` a través de su prop `onConfirm`
  };

  return (
    <Dialog open={activeDialog === "delete"} onOpenChange={close}>
      <ConfirmationDialogContent
        icon={ShieldAlert}
        title={t("delete_dialog.title")}
        description={t.rich("delete_dialog.description", {
          workspaceName: activeWorkspace.name,
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
        onClose={close}
        confirmButtonText={t("delete_dialog.confirm_button")}
        cancelButtonText={tDialogs("generic_cancelButton")}
        onConfirm={workspaceActions.deleteWorkspaceAction}
        isPending={false} // La gestión de isPending se hará en un hook futuro
        hiddenInputs={{ workspaceId: activeWorkspace.id }}
        confirmationText={activeWorkspace.name}
        confirmationLabel={t.rich("delete_dialog.confirmation_label", {
          workspaceName: activeWorkspace.name,
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      />
    </Dialog>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación Arquitectónica**: ((Implementada)) El componente ahora es un consumidor canónico del `ConfirmationDialogContent` refactorizado.
 * 2. **Simplificación y Cohesión**: ((Implementada)) Se ha eliminado el JSX para el body y footer, resultando en un componente más limpio y declarativo.
 *
 * @subsection Melhorias Futuras
 * 1. **Hook Soberano `useDeleteWorkspace`**: ((Vigente)) La lógica de `isPending` y `toast` debería ser extraída a su propio hook.
 *
 * =====================================================================
 */
