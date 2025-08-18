// src/components/workspaces/WorkspaceDialogs.tsx
/**
 * @file src/components/workspaces/WorkspaceDialogs.tsx
 * @description Componente de presentación puro que renderiza todos los diálogos
 *              modales relacionados con la gestión de workspaces. Ha sido refactorizado
 *              para consumir el nuevo `ConfirmationDialogContent` y gestionar
 *              su propio estado de diálogo.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ShieldAlert } from "lucide-react";

import { useDashboard } from "@/lib/context/DashboardContext";
import { useWorkspaceContext } from "@/lib/hooks/use-workspace-context";
import { ConfirmationDialogContent } from "@/components/ui/ConfirmationDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateWorkspaceForm } from "./CreateWorkspaceForm";
import { InviteMemberForm } from "./InviteMemberForm";

export function WorkspaceDialogs() {
  const t = useTranslations("WorkspaceSwitcher");
  const tDialogs = useTranslations("Dialogs");
  const { activeWorkspace } = useDashboard();
  const {
    createDialogOpen,
    setCreateDialogOpen,
    inviteDialogOpen,
    setInviteDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeleteWorkspace,
    isApiPending,
  } = useWorkspaceContext();

  const handleDeleteConfirm = (formData: FormData) => {
    handleDeleteWorkspace(formData);
    // El hook se encargará de cerrar el diálogo tras la acción
  };

  return (
    <>
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        {/* ... (Contenido de CreateWorkspaceForm sin cambios) ... */}
      </Dialog>

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        {/* ... (Contenido de InviteMemberForm sin cambios) ... */}
      </Dialog>

      {activeWorkspace && (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <ConfirmationDialogContent
            icon={ShieldAlert}
            title={t("delete_dialog.title")}
            description={t.rich("delete_dialog.description", {
              workspaceName: activeWorkspace.name,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
            confirmButtonText={t("delete_dialog.confirm_button")}
            cancelButtonText={tDialogs("generic_cancelButton")}
            onConfirm={handleDeleteConfirm}
            onClose={() => setDeleteDialogOpen(false)}
            isPending={isApiPending}
            hiddenInputs={{ workspaceId: activeWorkspace.id }}
            confirmationText={activeWorkspace.name}
            confirmationLabel={t.rich("delete_dialog.confirmation_label", {
              workspaceName: activeWorkspace.name,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          />
        </Dialog>
      )}
    </>
  );
}
// src/components/workspaces/WorkspaceDialogs.tsx
