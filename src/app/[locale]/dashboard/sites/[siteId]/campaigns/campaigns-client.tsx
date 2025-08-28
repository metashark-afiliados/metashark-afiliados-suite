// src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-client.tsx
/**
 * @file campaigns-client.tsx
 * @description Orquestador de UI de élite. Ha sido refactorizado para un componente
 *              de presentación 100% puro que consume el hook soberano
 *              `useCampaignsClient`, delegando toda la lógica de estado y
 *              acciones, cumpliendo con el SRP al más alto nivel. Corregido
 *              para alinear los tipos de props pasados al hook `useCampaignsClient`.
 * @author Raz Podestá - MetaShark Tech
 * @version 10.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";

import { CampaignsPageHeader } from "@/components/campaigns";
import { PaginatedDataTable } from "@/components/shared/PaginatedDataTable";
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
  initialSearchQuery: string; // Renombrado de 'searchQuery'
  initialStatus?: CampaignStatus; // Renombrado de 'status'
  initialSortBy?: "updated_at_desc" | "name_asc"; // Renombrado de 'sortBy'
}

/**
 * @public
 * @component CampaignsClient
 * @description Componente de presentación puro que ensambla la UI para la página de gestión de campañas.
 * @param {CampaignsClientProps} props - Propiedades iniciales pasadas desde el cargador de datos del servidor.
 * @returns {React.ReactElement}
 */
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
    siteId: site.id, // Se pasa 'site.id' explícitamente
    initialStatus,
    initialSortBy,
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
      />
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @subsection Melhorias Futuras
 * 1. **Contexto de Página de Campañas**: ((Vigente)) Para eliminar completamente el "prop drilling", el `CampaignsClient` podría actuar como un proveedor de contexto (`CampaignsPageContext.Provider`), haciendo que el valor de retorno del hook `useCampaignsClient` esté disponible para todos los componentes hijos sin necesidad de pasar props explícitamente.
 * 2. **Componente `CampaignFilters` Atómico**: ((Vigente)) La lógica de `handleStatusChange` y el renderizado de los controles de filtro y ordenamiento dentro de `CampaignsPageHeader` podrían ser extraídos a un nuevo componente atómico `CampaignFilters`, similar a `SiteFilters`.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación de Contrato de Hooks (`TS2345`)**: ((Implementada)) Se ha modificado la interfaz `CampaignsClientProps` y la llamada al hook `useCampaignsClient` para que las propiedades (`initialSearchQuery`, `initialStatus`, `initialSortBy`, `siteId`) se pasen explícitamente con los nombres y tipos correctos que espera el hook `useCampaignsPage`.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-client.tsx
