/**
 * @file src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-client.tsx
 * @description Orquestador de cliente de élite. Ha sido nivelado para construir
 *              y pasar explícitamente los objetos de props de texto, incluyendo
 *              `toastTexts`, a sus hijos, cumpliendo con el contrato de i18n
 *              completo y resolviendo todos los errores de tipo.
 * @author Raz Podestá
 * @version 3.1.0
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

  // --- INICIO DE CORRECCIÓN DE SINCRONIZACIÓN DE CONTRATO ---
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
  // --- FIN DE CORRECCIÓN DE SINCRONIZACIÓN DE CONTRATO ---

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
 * 1. **Sincronización de Contrato**: ((Implementada)) Se ha añadido la prop `toastTexts` al objeto de configuración de `getCampaignsColumns`, resolviendo el error de compilación `TS2345`.
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción de `toastTexts`**: ((Vigente)) El hook `useCampaignsPage` podría ser refactorizado para devolver este objeto de `toastTexts` ya construido, manteniendo al cliente más agnóstico.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-client.tsx
