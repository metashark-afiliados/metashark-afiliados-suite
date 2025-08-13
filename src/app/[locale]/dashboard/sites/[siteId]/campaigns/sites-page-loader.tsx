/**
 * @file src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-client.tsx
 * @description Orquestador de cliente de élite. Su única responsabilidad es consumir
 *              el hook soberano `useCampaignsPage` para obtener todo el estado y la
 *              lógica, y luego ensamblar la UI de gestión de campañas inyectando
 *              dichos datos, callbacks y textos internacionalizados a los componentes
 *              de presentación puros.
 * @author Raz Podestá
 * @version 2.3.0
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

// Definición de tipos locales para claridad y consistencia interna.
type CampaignStatus = "draft" | "published" | "archived";
type SortByOption = "updated_at_desc" | "name_asc";
type CampaignWithStatus = CampaignMetadata & {
  status?: CampaignStatus;
};

/**
 * @public
 * @interface CampaignsClientProps
 * @description Define el contrato de props que este componente de cliente espera
 *              recibir del cargador de datos del servidor (`sites-page-loader.tsx`).
 */
interface CampaignsClientProps {
  site: Pick<SiteWithCampaignCount, "id" | "subdomain">;
  initialCampaigns: CampaignMetadata[];
  totalCount: number;
  page: number;
  limit: number;
  searchQuery: string;
  status?: CampaignStatus;
  sortBy?: SortByOption;
}

/**
 * @public
 * @component CampaignsClient
 * @description Orquesta la UI completa para la página de gestión de campañas.
 * @param {CampaignsClientProps} props - Propiedades iniciales del servidor.
 * @returns {React.ReactElement} El componente de cliente renderizado.
 */
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
      duplicating: t("duplicating_toast"),
      archiving: t("archiving_toast"),
    },
  });

  return (
    <div className="space-y-6">
      <CampaignsPageHeader
        t={t}
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
      />
      <SearchInput
        placeholder={t("search.placeholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        clearAriaLabel={t("search.clear_aria")}
      />
      <DataTable<CampaignWithStatus>
        columns={columns}
        data={campaigns as CampaignWithStatus[]}
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
 * 1. **Arquitectura Soberana**: ((Implementada)) Este componente es un orquestador de UI puro, delegando toda su lógica al hook `useCampaignsPage`, lo que representa el patrón arquitectónico de élite para componentes de cliente.
 * 2. **Sincronización de Contratos**: ((Implementada)) Se han resuelto todos los errores de tipo (`TS2322`, `TS2345`) al sincronizar completamente los contratos de props con `CampaignsPageHeader` y `DataTable`.
 *
 * @subsection Melhorias Futuras
 * 1. **Precarga de Plantillas**: ((Vigente)) El `loader` del servidor podría precargar los datos de las plantillas de campaña y pasarlos a través de este componente hasta el `CampaignsPageHeader` para una UX de creación instantánea desde plantilla.
 *
 * =====================================================================
 */
