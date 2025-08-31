// src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-client.tsx
/**
 * @file campaigns-client.tsx
 * @description Orquestador de UI de élite. Ha sido refactorizado para obtener
 *              y propagar los textos de paginación a `PaginatedDataTable`,
 *              resolviendo el error de tipo TS2741 y completando el flujo de datos.
 * @author Raz Podestá - MetaShark Tech
 * @version 11.0.0
 * @date 2025-08-31
 */
"use client";

import React from "react";

import { CampaignsPageHeader } from "@/components/campaigns";
import { PaginatedDataTable } from "@/components/shared/PaginatedDataTable";
import { type PaginationTexts } from "@/components/shared/pagination-controls";
import { SearchInput } from "@/components/ui/SearchInput";
import { type CampaignMetadata } from "@/lib/data/campaigns";
import { type SiteWithCampaignCount } from "@/lib/data/sites/types";
import { useCampaignsClient } from "@/lib/hooks/useCampaignsClient";

type CampaignStatus = "draft" | "published" | "archived";

interface CampaignsClientProps {
  site: Pick<SiteWithCampaignCount, "id" | "name" | "subdomain">;
  initialCampaigns: CampaignMetadata[];
  totalCount: number;
  page: number;
  limit: number;
  initialSearchQuery: string;
  initialStatus?: CampaignStatus;
  initialSortBy?: "updated_at_desc" | "name_asc";
}

export function CampaignsClient(
  props: CampaignsClientProps
): React.ReactElement {
  const {
    site,
    initialCampaigns,
    totalCount,
    page,
    limit,
    initialSearchQuery,
    initialStatus,
    initialSortBy,
  } = props;

  const {
    t,
    columns,
    handleStatusChange,
    campaigns,
    isPending,
    isSyncing,
    mutatingId,
    searchTerm,
    setSearchTerm,
    statusFilter,
    sortBy,
    setSortBy,
    handleCreateCampaign,
  } = useCampaignsClient({
    initialCampaigns,
    initialSearchQuery,
    siteId: site.id,
    initialStatus,
    initialSortBy,
  });

  // --- INICIO DE REFACTORIZACIÓN (CONSTRUCCIÓN Y PROPAGACIÓN DE PROPS I18N) ---
  const paginationTexts: PaginationTexts = {
    previous: t("pagination.previous"),
    next: t("pagination.next"),
    page: t("pagination.page"),
  };
  // --- FIN DE REFACTORIZACIÓN ---

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
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <div className="w-full md:w-1/3">
        <SearchInput
          placeholder={t("search.placeholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          clearAriaLabel={t("search.clear_aria")}
          isLoading={isSyncing}
        />
      </div>
      <PaginatedDataTable
        columns={columns}
        data={campaigns}
        noResultsText={t("table.empty_state")}
        page={page}
        totalCount={totalCount}
        limit={limit}
        basePath={`/dashboard/sites/${site.id}/campaigns`}
        searchQuery={searchTerm}
        paginationTexts={paginationTexts} // <-- PROP INYECTADA
      />
    </div>
  );
}
// src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-client.tsx
