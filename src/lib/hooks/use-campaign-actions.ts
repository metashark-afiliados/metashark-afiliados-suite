// src/lib/hooks/use-campaign-actions.ts
/**
 * @file use-campaign-actions.ts
 * @description Hook de React atómico que encapsula la lógica para ejecutar acciones
 *              sobre campañas, como archivar y duplicar, incluyendo el feedback
 *              al usuario a través de `react-hot-toast`.
 * @author Raz Podestá
 * @version 2.0.0
 * @see .docs-espejo/lib/hooks/use-campaign-actions.ts.md
 */
"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";
import toast from "react-hot-toast";

import {
  archiveCampaignAction,
  duplicateCampaignAction,
} from "@/lib/actions/campaigns.actions";
import { type CampaignMetadata } from "@/lib/data/campaigns";
import { clientLogger } from "@/lib/logger";
import { isActionError } from "@/lib/validators";

interface UseCampaignActionsProps {
  handleUpdate?: (
    id: string,
    optimisticUpdate: Partial<CampaignMetadata>
  ) => void;
  handleDuplicate?: (id: string) => void;
}

/**
 * @public
 * @function useCampaignActions
 * @description Hook atómico que encapsula la lógica para ejecutar acciones sobre
 *              campañas.
 * @param {UseCampaignActionsProps} props - Los callbacks del hook optimista.
 * @returns Los manejadores de acciones listos para ser consumidos por la UI.
 */
export function useCampaignActions({
  handleUpdate,
  handleDuplicate,
}: UseCampaignActionsProps) {
  const t = useTranslations("CampaignsPage");

  const handleArchiveCampaign = useCallback(
    (campaignId: string) => {
      const context = { campaignId };
      clientLogger.trace(context, "[useCampaignActions] Archivando campaña.");
      handleUpdate?.(campaignId, { status: "archived", status_id: 3 });
      toast.promise(archiveCampaignAction(campaignId), {
        loading: t("toasts.archiving"),
        success: (result) => {
          if (isActionError(result)) throw new Error(result.error);
          return t("toasts.archive_success");
        },
        error: (err) =>
          t(`errors.${err.message}`) || t("errors.archive_failed"),
      });
    },
    [handleUpdate, t]
  );

  const handleDuplicateCampaign = useCallback(
    (campaignId: string) => {
      const context = { campaignId };
      clientLogger.trace(context, "[useCampaignActions] Duplicando campaña.");
      handleDuplicate?.(campaignId);
      toast.promise(duplicateCampaignAction(campaignId), {
        loading: t("toasts.duplicating"),
        success: (result) => {
          if (isActionError(result)) throw new Error(result.error);
          return t("toasts.duplicate_success");
        },
        error: (err) =>
          t(`errors.${err.message}`) || t("errors.duplication_failed"),
      });
    },
    [handleDuplicate, t]
  );

  return {
    handleArchiveCampaign,
    handleDuplicateCampaign,
  };
}
// src/lib/hooks/use-campaign-actions.ts
