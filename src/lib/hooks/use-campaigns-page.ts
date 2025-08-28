// src/lib/hooks/use-campaigns-page.ts
/**
 * @file use-campaigns-page.ts
 * @description Orquestador de hooks de élite. Ha sido blindado con un contrato
 *              de props explícito y exportado (`UseCampaignsPageProps`), resolviendo
 *              el error de módulo TS2724 en su consumidor.
 * @author Raz Podestá - MetaShark Tech
 * @version 8.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTransition, useCallback } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  createCampaignAction,
  deleteCampaignAction,
  archiveCampaignAction,
  duplicateCampaignAction,
} from "@/lib/actions/campaigns.actions";
import { type CampaignMetadata } from "@/lib/data/campaigns";
import { useOptimisticResourceManagement } from "@/lib/hooks/use-optimistic-resource-management";
import { useUrlStateSync } from "@/lib/hooks/ui/useUrlStateSync";
import { clientLogger } from "@/lib/logging";

type CampaignStatus = "draft" | "published" | "archived";
type SortByOption = "updated_at_desc" | "name_asc";

type CampaignFiltersState = {
  q: string;
  status: CampaignStatus | "all";
  sort: SortByOption;
};

// --- INICIO DE CORRECCIÓN DE CONTRATO (TS2724) ---
export interface UseCampaignsPageProps {
  initialCampaigns: CampaignMetadata[];
  initialSearchQuery: string;
  siteId: string;
  initialStatus?: CampaignStatus;
  initialSortBy?: SortByOption;
}
// --- FIN DE CORRECCIÓN DE CONTRATO (TS2724) ---

export function useCampaignsPage({
  initialCampaigns,
  initialSearchQuery,
  initialStatus,
  initialSortBy,
  siteId,
}: UseCampaignsPageProps) {
  const t = useTranslations("CampaignsPage");
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      affiliate_url: null,
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
      toast.success(t("toasts.create_success"));
      router.refresh();
    } else {
      toast.error(t(`errors.${result.error}` as any) || t("errors.unexpected"));
    }
  };

  const handleArchiveCampaign = useCallback(
    (campaignId: string) => {
      startActionTransition(() => {
        toast.promise(archiveCampaignAction(campaignId), {
          loading: t("toasts.archiving"),
          success: () => {
            router.refresh();
            return t("toasts.archive_success");
          },
          error: t("errors.archive_failed"),
        });
      });
    },
    [router, t]
  );

  const handleDuplicateCampaign = useCallback(
    (campaignId: string) => {
      startActionTransition(() => {
        toast.promise(duplicateCampaignAction(campaignId), {
          loading: t("toasts.duplicating"),
          success: () => {
            router.refresh();
            return t("toasts.duplicate_success");
          },
          error: t("errors.duplication_failed"),
        });
      });
    },
    [router, t]
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Factoría de Items Optimistas Atómica**: ((Vigente)) La lógica de `createOptimisticCampaign` podría ser extraída a un helper `optimisticItemFactory.ts` para una máxima reutilización si otros hooks necesitaran crear campañas optimistas.
 * 2. **Tipado de Errores con `isActionError`**: ((Vigente)) El `toast.error` en `handleCreateCampaign` utiliza `as any`. Para una seguridad de tipos de élite, se debería usar el guardián de tipo `isActionError` para asegurar que el `result.error` es una clave de i18n válida antes de pasarlo a `t()`.
 *
 * =====================================================================
 */
// src/lib/hooks/use-campaigns-page.ts
