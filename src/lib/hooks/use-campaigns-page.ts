// src/lib/hooks/use-campaigns-page.ts
/**
 * @file use-campaigns-page.ts
 * @description Orquestador de hooks de élite. Ha sido refactorizado
 *              holísticamente para consumir el hook `useUrlStateSync`,
 *              proporcionando una UX de filtros persistentes en la URL y
 *              simplificando su propia lógica de estado.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
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

export function useCampaignsPage({
  initialCampaigns,
  initialSearchQuery,
  initialStatus,
  initialSortBy,
  siteId,
}: {
  initialCampaigns: CampaignMetadata[];
  initialSearchQuery: string;
  siteId: string;
  initialStatus?: CampaignStatus;
  initialSortBy?: SortByOption;
}) {
  const t = useTranslations("CampaignsPage");
  const router = useRouter();
  const [isActionPending, startActionTransition] = useTransition();

  // --- INICIO DE REFACTORIZACIÓN: ESTADO EN URL ---
  const {
    state: filters,
    setState: setFilters,
    isSyncing,
  } = useUrlStateSync({
    initialState: {
      q: initialSearchQuery,
      status: initialStatus || "all",
      sort: initialSortBy || "updated_at_desc",
    },
    debounceKeys: ["q"],
  });
  // --- FIN DE REFACTORIZACIÓN: ESTADO EN URL ---

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
    setSearchTerm: (value: string) => setFilters((f) => ({ ...f, q: value })),
    statusFilter: filters.status as CampaignStatus,
    setStatusFilter: (status?: CampaignStatus | "all") =>
      setFilters((f) => ({ ...f, status: status || "all" })),
    sortBy: filters.sort as SortByOption,
    setSortBy: (sort: SortByOption) => setFilters((f) => ({ ...f, sort })),
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
 * @subsection Melhorias Adicionadas
 * 1. **Consistencia de UX (Filtros en URL)**: ((Implementada)) Se ha reemplazado el hook `useCampaignFilters` por `useUrlStateSync`. La página de "Campañas" ahora tiene filtros persistentes y compartibles, igual que la página "Mis Sitios", cumpliendo el objetivo de la ÉPICA 8.
 * 2. **Simplificación de Lógica (DRY)**: ((Implementada)) Al consumir el hook genérico, se ha eliminado la lógica de estado de filtros duplicada que existía en `useCampaignFilters`, haciendo este hook más simple y mantenible.
 * 3. **Feedback de Sincronización de URL**: ((Implementada)) El hook ahora expone el estado `isSyncing` de `useUrlStateSync`, que será consumido por la UI para proporcionar feedback visual al usuario.
 *
 * @subsection Melhorias Futuras
 * 1. **Factoría de Items Optimistas Atómica**: ((Vigente)) La lógica de `createOptimisticCampaign` podría ser extraída a un helper `optimisticItemFactory.ts` para una máxima reutilización.
 *
 * =====================================================================
 */
// src/lib/hooks/use-campaigns-page.ts
