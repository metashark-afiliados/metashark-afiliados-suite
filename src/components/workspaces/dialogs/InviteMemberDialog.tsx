// src/components/workspaces/dialogs/InviteMemberDialog.tsx
/**
 * @file InviteMemberDialog.tsx
 * @description Aparato de UI atómico que encapsula el modal para invitar
 *              nuevos miembros a un workspace.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useTranslations } from "next-intl";

import { useDashboard } from "@/lib/context/DashboardContext";
import { useWorkspaceDialogStore } from "@/lib/hooks/useWorkspaceDialogStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InviteMemberForm } from "../InviteMemberForm";

export function InviteMemberDialog() {
  const t = useTranslations("WorkspaceSwitcher");
  const { activeDialog, close } = useWorkspaceDialogStore();
  const { activeWorkspace } = useDashboard();

  if (!activeWorkspace) return null;

  const isOpen = activeDialog === "invite";

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("inviteMember_button")}</DialogTitle>
          <DialogDescription>
            {t.rich("inviteMember_description", {
              workspaceName: activeWorkspace.name,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </DialogDescription>
        </DialogHeader>
        <InviteMemberForm workspaceId={activeWorkspace.id} onSuccess={close} />
      </DialogContent>
    </Dialog>
  );
}
// src/components/workspaces/dialogs/InviteMemberDialog.tsx
