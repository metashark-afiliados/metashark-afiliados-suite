// src/components/campaigns/cells/actions/CampaignDeleteDialog.tsx
/**
 * @file CampaignDeleteDialog.tsx
 * @description Componente de presentación atómico y puro. Su única responsabilidad
 *              es renderizar el diálogo de confirmación para eliminar una campaña.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";
import React from "react";
import { ShieldAlert } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmationDialogContent } from "@/components/ui/ConfirmationDialog";
import { type CampaignMetadata } from "@/lib/data/campaigns";

interface CampaignDeleteDialogProps {
  campaign: CampaignMetadata;
  t: any; // Simplified for brevity, should be typed Translation function
  tDialogs: any;
  handleDelete: (formData: FormData) => void;
  isPending: boolean;
  mutatingId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function CampaignDeleteDialog({
  campaign,
  t,
  tDialogs,
  handleDelete,
  isPending,
  mutatingId,
  isOpen,
  onOpenChange,
}: CampaignDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <ConfirmationDialogContent
        icon={ShieldAlert}
        title={t("deleteDialog.title")}
        description={t.rich("deleteDialog.description", {
          campaignName: campaign.name,
          strong: (chunks: any) => <strong>{chunks}</strong>,
        })}
        confirmButtonText={t("deleteDialog.confirmButton")}
        cancelButtonText={tDialogs("generic_cancelButton")}
        onConfirm={handleDelete}
        onClose={() => onOpenChange(false)}
        isPending={isPending && mutatingId === campaign.id}
        hiddenInputs={{ campaignId: campaign.id }}
        confirmationText={campaign.name}
        confirmationLabel={t.rich("deleteDialog.confirmation_label", {
          campaignName: campaign.name,
          strong: (chunks: any) => <strong>{chunks}</strong>,
        })}
      />
    </Dialog>
  );
}
// src/components/campaigns/cells/actions/CampaignDeleteDialog.tsx
