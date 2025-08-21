// src/lib/hooks/use-campaign-actions.ts
"use client";

import { useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import {
  archiveCampaignAction,
  duplicateCampaignAction,
} from "@/lib/actions/campaigns.actions";
import { logger } from "@/lib/logging";
import { type CampaignMetadata } from "@/lib/data/campaigns";

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
 *              campañas, como archivar y duplicar, incluyendo el feedback al usuario.
 * @param {UseCampaignActionsProps} props - Los callbacks del hook optimista.
 * @returns Los manejadores de acciones listos para ser consumidos por la UI.
 * @version 1.1.0
 * @author Raz Podestá
 */
export function useCampaignActions({
  handleUpdate,
  handleDuplicate,
}: UseCampaignActionsProps) {
  const t = useTranslations("CampaignsPage");

  const handleArchiveCampaign = useCallback(
    (campaignId: string) => {
      logger.trace(`[useCampaignActions] Archivando campaña`, { campaignId });
      handleUpdate?.(campaignId, { status: "archived" });
      toast.promise(archiveCampaignAction(campaignId), {
        loading: t("toasts.archiving"),
        success: t("toasts.archive_success"),
        error: t("errors.archive_failed"),
      });
    },
    [handleUpdate, t]
  );

  const handleDuplicateCampaign = useCallback(
    (campaignId: string) => {
      logger.trace(`[useCampaignActions] Duplicando campaña`, { campaignId });
      handleDuplicate?.(campaignId);
      toast.promise(duplicateCampaignAction(campaignId), {
        loading: t("toasts.duplicating"),
        success: t("toasts.duplicate_success"),
        error: t("errors.duplication_failed"),
      });
    },
    [handleDuplicate, t]
  );

  return {
    handleArchiveCampaign,
    handleDuplicateCampaign,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato de API**: ((Implementada)) Se ha corregido la firma de `handleUpdate` para que coincida con la del hook `useOptimisticResourceManagement`, resolviendo el error de tipo.
 *
 * =====================================================================
 */
