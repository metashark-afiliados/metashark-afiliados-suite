// src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-client.tsx
/**
 * @file campaigns-client.tsx
 * @description Orquestador de UI de élite. Ha sido refactorizado para
 *              ensamblar la nueva arquitectura de hooks soberanos y
 *              delegar la lógica de creación al `CampaignsPageHeader`.
 * @author Raz Podestá
 * @version 6.0.0
 */
"use client";

import React from "react";
import { useFormatter, useTranslations } from "next-intl";

import {
  CampaignsPageHeader,
  getCampaignsColumns,
} from "@/components/campaigns";
import { DataTable } from "@/components/shared/data-table";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { SearchInput } from "@/components/ui/SearchInput";
import { useCampaignsPage } from "@/lib/hooks/use-campaigns-page";
import { type CampaignMetadata } from "@/lib/data/campaigns";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { logger } from "@/lib/logging";

type CampaignStatus = "draft" | "published" | "archived";

interface CampaignsClientProps {
  site: Pick<SiteWithCampaignCount, "id" | "name" | "subdomain">;
  initialCampaigns: CampaignMetadata[];
  totalCount: number;
  page: number;
  limit: number;
  searchQuery: string;
  status?: CampaignStatus;
  sortBy?: "updated_at_desc" | "name_asc";
}

export function CampaignsClient({
  site,
  initialCampaigns,
  totalCount,
  page,
  limit,
  searchQuery,
  status,
  sortBy,
}: CampaignsClientProps): React.ReactElement {
  logger.trace("[CampaignsClient] Renderizando orquestador de UI.");
  const t = useTranslations("CampaignsPage");
  const tDialogs = useTranslations("Dialogs");
  const format = useFormatter();

  const {
    campaigns,
    isPending,
    mutatingId,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy: currentSortBy,
    setSortBy,
    handleDelete,
    handleArchiveCampaign,
    handleDuplicateCampaign,
    handleCreateCampaign,
  } = useCampaignsPage({
    initialCampaigns,
    initialSearchQuery: searchQuery,
    initialStatus: status,
    initialSortBy: sortBy,
    siteId: site.id,
  });

  const handleStatusChange = (newStatus: CampaignStatus | "all") => {
    setStatusFilter(newStatus === "all" ? undefined : newStatus);
  };

  const columns = getCampaignsColumns({
    t,
    tDialogs,
    format,
    handleDelete: handleDelete!,
    handleArchive: handleArchiveCampaign,
    handleDuplicate: handleDuplicateCampaign,
    isPending,
    mutatingId,
    toastTexts: {
      duplicating: t("toasts.duplicating"),
      archiving: t("toasts.archiving"),
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <CampaignsPageHeader
        t={t}
        site={site}
        handleCreate={handleCreateCampaign!}
        isPending={isPending}
        mutatingId={mutatingId}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        sortBy={currentSortBy}
        onSortChange={setSortBy}
      />
      <div className="w-full md:w-1/3">
        <SearchInput
          placeholder={t("search.placeholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          clearAriaLabel={t("search.clear_aria")}
        />
      </div>
      <DataTable
        columns={columns}
        data={campaigns}
        noResultsText={t("table.empty_state")}
      />
      <PaginationControls
        page={page}
        totalCount={totalCount}
        limit={limit}
        basePath={`/dashboard/sites/${site.id}/campaigns`}
        searchQuery={searchTerm}
        texts={{
          previousPageLabel: t("pagination.previous"),
          nextPageLabel: t("pagination.next"),
          pageLabelTemplate: t("pagination.page"),
        }}
      />
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Ensamblaje Puro**: ((Implementada)) El componente ahora es un ensamblador puro que consume el hook orquestador `useCampaignsPage` y delega la lógica y el estado a sus hijos, cumpliendo la "Filosofía LEGO".
 * 2. **Sincronización de Contrato de Hook**: ((Implementada)) El componente ha sido completamente sincronizado con la nueva API del hook `useCampaignsPage`, eliminando código obsoleto.
 *
 * @subsection Melhorias Futuras
 * 1. **Estado de Carga de Búsqueda**: ((Vigente)) El `SearchInput` podría recibir la prop `isLoading` del futuro hook `useUrlStateSync` para mostrar un spinner mientras se actualiza la URL.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-client.tsx
