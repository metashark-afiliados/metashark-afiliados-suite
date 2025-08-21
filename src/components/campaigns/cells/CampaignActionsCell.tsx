// src/components/campaigns/cells/CampaignActionsCell.tsx
/**
 * @file CampaignActionsCell.tsx
 * @description Ensamblador de UI de alto nivel. Su única responsabilidad es
 *              orquestar los componentes atómicos `CampaignActionMenu` y
 *              `CampaignDeleteDialog`, conectándolos a través del hook de estado
 *              `useDialogState`.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";
import React from "react";
import { useDialogState } from "@/lib/hooks/ui/useDialogState";
import { type CampaignMetadata } from "@/lib/data/campaigns";
import { type GetCampaignsColumnsParams } from "../CampaignsTableColumns";
import { CampaignActionMenu, CampaignDeleteDialog } from "./actions";

type CampaignActionsCellProps = Omit<GetCampaignsColumnsParams, "format"> & {
  campaign: CampaignMetadata;
};

export function CampaignActionsCell(props: CampaignActionsCellProps) {
  const { campaign, handleDuplicate, handleArchive } = props;
  const { isOpen, setIsOpen, open } = useDialogState();

  return (
    <div className="text-right">
      <CampaignActionMenu
        campaign={campaign}
        t={props.t}
        onDuplicate={() => handleDuplicate(campaign.id)}
        onArchive={() => handleArchive(campaign.id)}
        onDeleteClick={open}
      />
      <CampaignDeleteDialog
        {...props}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </div>
  );
}
// src/components/campaigns/cells/CampaignActionsCell.tsx
