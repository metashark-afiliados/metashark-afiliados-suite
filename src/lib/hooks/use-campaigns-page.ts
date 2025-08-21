// src/lib/hooks/use-campaigns-page.ts
"use client";

import { useTranslations } from "next-intl";

import {
  createCampaignAction,
  deleteCampaignAction,
} from "@/lib/actions/campaigns.actions";
import { type CampaignMetadata } from "@/lib/data/campaigns";
import { useOptimisticResourceManagement } from "@/lib/hooks/use-optimistic-resource-management";
import { useCampaignActions } from "./use-campaign-actions";
import { useCampaignFilters } from "./use-campaign-filters";

/**
 * @public
 * @function useCampaignsPage
 * @description Orquestador de hooks de élite para la página de gestión de campañas.
 * @param {object} props - Propiedades de inicialización.
 * @returns Un objeto con el estado y los manejadores para la UI.
 * @version 4.1.0
 * @author Raz Podestá
 */
export function useCampaignsPage({
  initialCampaigns,
  initialSearchQuery,
  initialStatus,
  initialSortBy,
  siteId, // <-- PROP RESTAURADA
}: {
  initialCampaigns: CampaignMetadata[];
  initialSearchQuery: string;
  siteId: string; // <-- PROP RESTAURADA
  initialStatus?: "draft" | "published" | "archived";
  initialSortBy?: "updated_at_desc" | "name_asc";
}) {
  const t = useTranslations("CampaignsPage");

  const {
    items: campaigns,
    isPending,
    mutatingId,
    handleCreate,
    handleDelete,
    handleUpdate,
    handleDuplicate,
  } = useOptimisticResourceManagement<CampaignMetadata>({
    initialItems: initialCampaigns,
    entityName: t("entityName"),
    createAction: createCampaignAction,
    deleteAction: deleteCampaignAction,
  });

  const { handleArchiveCampaign, handleDuplicateCampaign } = useCampaignActions(
    {
      handleUpdate,
      handleDuplicate,
    }
  );

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
  } = useCampaignFilters({
    initialSearchQuery,
    initialStatus,
    initialSortBy,
  });

  return {
    campaigns,
    isPending,
    mutatingId,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    handleCreateCampaign: handleCreate,
    handleDelete,
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
 * 1. **Sincronización de Contrato de API**: ((Implementada)) Se ha añadido la prop `siteId` al hook, resolviendo el error de compilación TS2353.
 *
 * =====================================================================
 */
