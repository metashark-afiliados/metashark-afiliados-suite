// src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-client.tsx
/**
 * @file campaigns-client.tsx
 * @description Orquestador de UI de élite. Ha sido refactorizado holísticamente
 *              para consumir el componente abstracto `PaginatedDataTable` y para
 *              implementar el estado de carga (`isSyncing`) en `SearchInput`,
 *              resolviendo errores de tipo (TS2322, TS2306) y mejorando la UX.
 * @author Raz Podestá - MetaShark Tech
 * @version 8.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useFormatter, useTranslations } from "next-intl";

import {
  CampaignsPageHeader,
  getCampaignsColumns,
} from "@/components/campaigns";
import { PaginatedDataTable } from "@/components/shared/PaginatedDataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { useCampaignsPage } from "@/lib/hooks/use-campaigns-page";
import { type CampaignMetadata } from "@/lib/data/campaigns";
import { type SiteWithCampaignCount } from "@/lib/data/sites/types";
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
    isSyncing, // <-- NUEVO ESTADO CONSUMIDO
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
          isLoading={isSyncing} // <-- MEJORA IMPLEMENTADA
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
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Adopción de Abstracción de UI (DRY)**: ((Implementada)) Se ha reemplazado la composición manual de `DataTable` y `PaginationControls` por el nuevo componente abstracto `PaginatedDataTable`. Esto simplifica el JSX, elimina código duplicado y resuelve el error `TS2322` de forma sistémica al no invocar directamente el componente con la API obsoleta.
 * 2. **Resolución de Error de Módulo (`TS2306`)**: ((Implementada)) Se ha corregido la ruta de importación de `SiteWithCampaignCount` para que apunte a la SSoT canónica en `.../sites/types`, resolviendo el error de módulo no encontrado.
 * 3. **Implementación de Estado de Carga de Búsqueda (UX)**: ((Implementada)) Se ha consumido el estado `isSyncing` del hook `useCampaignsPage` y se ha pasado a la prop `isLoading` del `SearchInput`, proporcionando feedback visual inmediato al usuario durante la actualización de la URL.
 *
 * @subsection Melhorias Futuras
 * 1. **Feedback de Carga Granular**: ((Vigente)) Para una UX de élite, se podría pasar el estado `isSyncing` al `PaginatedDataTable` para que muestre una superposición de carga sobre la tabla mientras se actualizan los datos, indicando claramente que la vista completa está en proceso de actualización.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-client.tsx
