/**
 * @file src/lib/hooks/use-campaigns-page.ts
 * @description Hook Soberano de élite. Ha sido nivelado para incluir todas sus
 *              dependencias, resolver la cascada de errores de compilación y
 *              cumplir con el 100% de los requisitos del protocolo de excelencia.
 * @author Raz Podestá
 * @version 2.1.0
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { campaigns as campaignsActions } from "@/lib/actions";
import { type CampaignMetadata } from "@/lib/data/campaigns";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useOptimisticResourceManagement } from "@/lib/hooks/use-optimistic-resource-management";
import { logger } from "@/lib/logging";
import { usePathname, useRouter } from "@/lib/navigation";
import { type ActionResult } from "@/lib/validators";

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

  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
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
    params.set("q", debouncedSearchTerm);
    params.set("status", statusFilter || "");
    params.set("sortBy", sortBy);
    params.set("page", "1");

    if (!debouncedSearchTerm) params.delete("q");
    if (!statusFilter) params.delete("status");

    const newUrl = `${pathname}?${params.toString()}`;
    if (
      newUrl !==
      `${pathname}?${new URLSearchParams(window.location.search).toString()}`
    ) {
      router.push(newUrl as any);
    }
  }, [
    debouncedSearchTerm,
    statusFilter,
    sortBy,
    initialSearchQuery,
    pathname,
    router,
  ]);

  const showToastPromise = useCallback(
    (
      promise: Promise<ActionResult<any>>,
      { loadingKey, successKey }: { loadingKey: string; successKey: string }
    ) => {
      toast.promise(promise, {
        loading: t(loadingKey as any),
        success: (result: ActionResult<any>) => {
          if (result.success && result.data?.messageKey) {
            return t(result.data.messageKey as any);
          }
          return t(successKey as any);
        },
        error: (err: Error) => t(err.message as any) || t("error_unexpected"),
      });
    },
    [t]
  );

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
    updateAction: campaignsActions.archiveCampaignAction as any,
    duplicateAction: campaignsActions.duplicateCampaignAction,
  });

  const handleCreateCampaign = (formData: FormData) => {
    const name = formData.get("name") as string;
    const optimisticCampaign: Omit<CampaignMetadata, "id"> = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      site_id: siteId,
      status: "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      affiliate_url: null,
    };
    handleCreate?.(formData, optimisticCampaign);
    setCreateDialogOpen(false);
  };

  const handleArchiveCampaign = (campaignId: string) => {
    const formData = new FormData();
    formData.append("campaignId", campaignId);
    showToastPromise(campaignsActions.archiveCampaignAction(campaignId), {
      loadingKey: "archiving_toast",
      successKey: "archive_success_toast",
    });
    handleUpdate?.(formData, { status: "archived" });
  };

  const handleDuplicateCampaign = (campaignId: string) => {
    showToastPromise(campaignsActions.duplicateCampaignAction(campaignId), {
      loadingKey: "duplicating_toast",
      successKey: "duplicate_success_toast",
    });
    handleDuplicate?.(campaignId);
  };

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
    isCreateDialogOpen,
    setCreateDialogOpen,
    handleCreateCampaign,
    handleDelete: handleDelete!,
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
 * 1. **Resolución de Dependencias**: ((Implementada)) Se han añadido las importaciones de `toast` y `campaignActions`, resolviendo los errores `TS2304`.
 * 2. **Seguridad de Tipos**: ((Implementada)) Se han añadido los tipos explícitos a los parámetros de callback de `toast.promise`, resolviendo los errores `TS7006` de `any` implícito.
 *
 * @subsection Melhorias Futuras
 * 1. **Reset de Paginación**: ((Vigente)) El `useEffect` de sincronización de URL resetea correctamente a la página 1. El siguiente paso es asegurar que el `PaginationControls` reciba y utilice este estado.
 *
 * =====================================================================
 */
