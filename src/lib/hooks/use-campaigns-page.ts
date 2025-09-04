// src/lib/hooks/use-campaigns-page.ts
/**
 * @file use-campaigns-page.ts
 * @description Hook orquestador soberano. Sincronizado para consumir el contrato
 *              de API puro de `useOptimisticResourceManagement`, resolviendo el error
 *              de tipo TS2345 y alineándose con la arquitectura de composición de hooks.
 * @author Raz Podestá - MetaShark Tech
 * @version 11.0.0
 * @see .docs-espejo/lib/hooks/use-campaigns-page.ts.md
 */
"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import toast from "react-hot-toast";

import {
  archiveCampaignAction,
  createCampaignAction,
  deleteCampaignAction,
  duplicateCampaignAction,
} from "@/lib/actions/campaigns.actions";
import { type CampaignMetadata } from "@/lib/data/campaigns";
import { useUrlStateSync } from "@/lib/hooks/ui/useUrlStateSync";
import { clientLogger } from "@/lib/logger";
import { isActionError, type ValidationErrorKey } from "@/lib/validators";
import { useOptimisticResourceManagement } from "./use-optimistic-resource-management";

type CampaignStatus = "draft" | "published" | "archived";
type SortByOption = "updated_at_desc" | "name_asc" | "name_desc";

type CampaignFiltersState = {
  q: string;
  status: CampaignStatus | "all";
  sort: SortByOption;
};

export interface UseCampaignsPageProps {
  initialCampaigns: CampaignMetadata[];
  initialSearchQuery: string;
  siteId: string;
  initialStatus?: CampaignStatus;
  initialSortBy?: SortByOption;
}

/**
 * @public
 * @function useCampaignsPage
 * @description Orquesta toda la lógica de estado y de negocio para la página de gestión de campañas.
 * @param {UseCampaignsPageProps} props - Propiedades iniciales para el hook.
 * @returns La API completa para gestionar la UI de la página de campañas.
 */
export function useCampaignsPage({
  initialCampaigns,
  initialSearchQuery,
  initialStatus,
  initialSortBy,
  siteId,
}: UseCampaignsPageProps) {
  clientLogger.trace({}, "[useCampaignsPage] Hook soberano inicializado.");
  const t = useTranslations("CampaignsPage");
  const tErrors = useTranslations("shared.ValidationErrors");
  const router = useRouter();
  const [isActionPending, startActionTransition] = useTransition();

  const {
    state: filters,
    setState: setFilters,
    isSyncing,
  } = useUrlStateSync<CampaignFiltersState>({
    initialState: {
      q: initialSearchQuery,
      status: initialStatus || "all",
      sort: initialSortBy || "updated_at_desc",
    },
    debounceKeys: ["q"],
  });

  const createOptimisticCampaign = (formData: FormData): CampaignMetadata => {
    const name = formData.get("name") as string;
    return {
      id: `optimistic-${Date.now()}`,
      name: name || "Nueva Campaña",
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      site_id: siteId,
      status: "draft",
      status_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      affiliate_url: null,
      creation_id: `optimistic-creation-${Date.now()}`,
    };
  };

  const {
    items: campaigns,
    isPending: isOptimisticPending,
    mutatingId,
    handleCreate,
    handleDelete,
  } = useOptimisticResourceManagement<CampaignMetadata>({
    initialItems: initialCampaigns,
    createAction: createCampaignAction,
    deleteAction: deleteCampaignAction,
    createOptimisticItem: createOptimisticCampaign,
  });

  const handleCreateCampaign = async (formData: FormData) => {
    if (!handleCreate) return;
    const result = await handleCreate(formData);
    if (result.success) {
      toast.success(tErrors("campaigns.create_success"));
      router.refresh();
    } else if (isActionError(result)) {
      toast.error(tErrors(result.error, { defaultValue: result.error }));
    }
  };

  const handleArchiveCampaign = useCallback(
    (campaignId: string) => {
      clientLogger.trace(
        { campaignId },
        "[useCampaignsPage] Archivando campaña."
      );
      startActionTransition(() => {
        toast.promise(archiveCampaignAction(campaignId), {
          loading: t("toasts.archiving"),
          success: (result) => {
            if (isActionError(result)) throw new Error(result.error);
            router.refresh();
            return tErrors(result.data.messageKey);
          },
          error: (err) =>
            tErrors(err.message, { defaultValue: t("errors.archive_failed") }),
        });
      });
    },
    [router, t, tErrors]
  );

  const handleDuplicateCampaign = useCallback(
    (campaignId: string) => {
      clientLogger.trace(
        { campaignId },
        "[useCampaignsPage] Duplicando campaña."
      );
      startActionTransition(() => {
        toast.promise(duplicateCampaignAction(campaignId), {
          loading: t("toasts.duplicating"),
          success: (result) => {
            if (isActionError(result)) throw new Error(result.error);
            router.refresh();
            return tErrors("campaigns.duplicate_success");
          },
          error: (err) =>
            tErrors(err.message, {
              defaultValue: t("errors.duplication_failed"),
            }),
        });
      });
    },
    [router, t, tErrors]
  );

  return {
    campaigns,
    isPending: isOptimisticPending || isActionPending,
    isSyncing,
    mutatingId,
    searchTerm: filters.q,
    setSearchTerm: (value: string) =>
      setFilters((f: CampaignFiltersState) => ({ ...f, q: value })),
    statusFilter: filters.status,
    setStatusFilter: (status?: CampaignStatus | "all") =>
      setFilters((f: CampaignFiltersState) => ({
        ...f,
        status: status || "all",
      })),
    sortBy: filters.sort,
    setSortBy: (sort: SortByOption) =>
      setFilters((f: CampaignFiltersState) => ({ ...f, sort })),
    handleCreateCampaign,
    handleDelete,
    handleArchiveCampaign,
    handleDuplicateCampaign,
  };
}
// src/lib/hooks/use-campaigns-page.ts
