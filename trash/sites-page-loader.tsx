/**
 * @file src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-client.tsx
 * @description Orquestador de cliente de élite. Ha sido nivelado para alinear
 *              el contrato de tipos del `DataTable` con el de `getCampaignsColumns`,
 *              resolviendo un error de invariancia de tipos (`TS2322`).
 * @author Raz Podestá
 * @version 3.2.0
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

interface CampaignsClientProps {
  site: Pick<SiteWithCampaignCount, "id" | "subdomain" | "name">;
  workspace: { name: string };
  initialCampaigns: CampaignMetadata[];
  totalCount: number;
  page: number;
  limit: number;
  searchQuery: string;
  status?: "draft" | "published" | "archived";
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
    isCreateDialogOpen,
    setCreateDialogOpen,
    handleCreateCampaign,
    handleDelete,
    handleArchiveCampaign,
    handleDuplicateCampaign,
  } = useCampaignsPage({
    initialCampaigns,
    initialSearchQuery: searchQuery,
    initialStatus: status,
    initialSortBy: sortBy,
    siteId: site.id,
  });

  const columns = getCampaignsColumns({
    t,
    tDialogs,
    format,
    handleDelete,
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
    <div className="space-y-6">
      <CampaignsPageHeader
        site={site}
        isCreateDialogOpen={isCreateDialogOpen}
        setCreateDialogOpen={setCreateDialogOpen}
        handleCreate={handleCreateCampaign}
        isPending={isPending}
        mutatingId={mutatingId}
        statusFilter={statusFilter}
        onStatusChange={(newStatus) =>
          setStatusFilter(newStatus === "all" ? undefined : newStatus)
        }
        sortBy={currentSortBy}
        onSortChange={setSortBy}
        t={t}
      />
      <SearchInput
        placeholder={t("search.placeholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        clearAriaLabel={t("search.clear_aria")}
      />
      {/* --- INICIO DE CORRECCIÓN DE TIPO --- */}
      <DataTable<CampaignMetadata>
        columns={columns}
        data={campaigns}
        noResultsText={t("table.empty_state")}
      />
      {/* --- FIN DE CORRECCIÓN DE TIPO --- */}
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
 * 1. **Resolución de Invariancia de Tipos**: ((Implementada)) Se ha eliminado el tipo redundante `CampaignWithStatus` y se ha tipado explícitamente el `DataTable` con `CampaignMetadata`. Esto alinea los contratos y resuelve el error de compilación `TS2322`.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-client.tsx
