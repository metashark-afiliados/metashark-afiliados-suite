// src/lib/hooks/use-campaigns-page.ts
/**
 * @file src/lib/hooks/use-campaigns-page.ts
 * @description Hook Orquestador de élite. Compone hooks atómicos para construir
 *              la lógica completa de la página de gestión de campañas, incluyendo
 *              UI optimista, sincronización de filtros de URL y gestión de estado.
 * @author Raz Podestá
 * @version 3.0.0
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { campaigns as campaignsActions } from "@/lib/actions";
import { type CampaignMetadata } from "@/lib/data/campaigns";
import { useOptimisticResourceManagement } from "@/lib/hooks/use-optimistic-resource-management";
import { logger } from "@/lib/logging";
import { usePathname, useRouter } from "@/lib/navigation";
import { useDebounce } from "./use-debounce";

type CampaignStatus = "draft" | "published" | "archived";
type SortByOption = "updated_at_desc" | "name_asc";

export function useCampaignsPage({
  initialCampaigns,
  initialSearchQuery,
  initialStatus,
  initialSortBy,
  siteId,
}: {
  initialCampaigns: CampaignMetadata[];
  initialSearchQuery: string;
  initialStatus?: CampaignStatus;
  initialSortBy?: SortByOption;
  siteId: string;
}) {
  const t = useTranslations("CampaignsPage");
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | undefined>(
    initialStatus
  );
  const [sortBy, setSortBy] = useState<SortByOption>(
    initialSortBy || "updated_at_desc"
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const updateParam = (key: string, value: string | undefined) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };

    updateParam("q", debouncedSearchTerm);
    updateParam("status", statusFilter);
    updateParam("sortBy", sortBy);
    params.set("page", "1"); // Reset pagination on filter change

    router.push(`${pathname}?${params.toString()}` as any, { scroll: false });
  }, [debouncedSearchTerm, statusFilter, sortBy, pathname, router]);

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
    createAction: campaignsActions.createCampaignAction,
    deleteAction: campaignsActions.deleteCampaignAction,
    updateAction: campaignsActions.archiveCampaignAction as any, // Mapeo de update a archive
    duplicateAction: campaignsActions.duplicateCampaignAction,
  });

  const handleArchiveCampaign = useCallback(
    (campaignId: string) => {
      logger.trace(`[useCampaignsPage] Archivando campaña`, { campaignId });
      const formData = new FormData();
      formData.append("campaignId", campaignId);
      handleUpdate?.(formData, { status: "archived" });
      toast.promise(campaignsActions.archiveCampaignAction(campaignId), {
        loading: t("toasts.archiving"),
        success: t("toasts.archive_success"),
        error: t("errors.archive_failed"),
      });
    },
    [handleUpdate, t]
  );

  const handleDuplicateCampaign = useCallback(
    (campaignId: string) => {
      logger.trace(`[useCampaignsPage] Duplicando campaña`, { campaignId });
      handleDuplicate?.(campaignId);
      toast.promise(campaignsActions.duplicateCampaignAction(campaignId), {
        loading: t("toasts.duplicating"),
        success: t("toasts.duplicate_success"),
        error: t("errors.duplication_failed"),
      });
    },
    [handleDuplicate, t]
  );

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
 * 1. **Arquitectura de Orquestador Puro**: ((Implementada)) El hook ahora compone `useOptimisticResourceManagement` y la lógica de sincronización de URL, reduciendo su complejidad y mejorando su cohesión.
 * 2. **Sincronización de Filtros Múltiples**: ((Implementada)) El `useEffect` ahora sincroniza `q`, `status` y `sortBy` con la URL, proporcionando una gestión de estado de filtros completa y robusta.
 * 3. **Observabilidad Completa**: ((Implementada)) Las acciones de usuario ahora son registradas con `logger.trace`, y el feedback se gestiona con `toast.promise` para una UX consistente.
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción de Sincronización de URL**: ((Vigente)) La lógica del `useEffect` para sincronizar múltiples parámetros es un candidato perfecto para ser abstraído a una versión avanzada de `useSearchSync` (ej. `useUrlStateSync`) que acepte un objeto de parámetros.
 *
 * =====================================================================
 */
// src/lib/hooks/use-campaigns-page.ts
