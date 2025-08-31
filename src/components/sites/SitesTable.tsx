// src/components/sites/SitesTable.tsx
/**
 * @file SitesTable.tsx
 * @description Aparato de UI de ensamblaje puro y de presentación. Ha sido
 *              refactorizado para aceptar y propagar los textos de paginación
 *              requeridos por su hijo `PaginatedDataTable`.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-31
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { PaginatedDataTable } from "@/components/shared/PaginatedDataTable";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { clientLogger } from "@/lib/logging";
import { getSitesTableColumns } from "./SitesTableColumns";
import { type PaginationTexts } from "@/components/shared/pagination-controls";

export interface SitesTableProps {
  sites: SiteWithCampaignCount[];
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  deletingSiteId: string | null;
  handleUpdateSiteName: (siteId: string, newName: string) => Promise<void>;
  isUpdatingName: boolean;
  updatingSiteNameId: string | null;
  page: number;
  totalCount: number;
  limit: number;
  basePath: string;
  paginationTexts: PaginationTexts; // <-- NUEVA PROP
  searchQuery?: string;
}

export function SitesTable(props: SitesTableProps): React.ReactElement {
  clientLogger.trace(
    "[SitesTable] Renderizando ensamblador de tabla de sitios."
  );
  const t = useTranslations("SitesPage");

  const columns = React.useMemo(
    () =>
      getSitesTableColumns({
        onDelete: props.onDelete,
        isPending: props.isPending,
        deletingSiteId: props.deletingSiteId,
        handleUpdateSiteName: props.handleUpdateSiteName,
        isUpdatingName: props.isUpdatingName,
        updatingSiteNameId: props.updatingSiteNameId,
      }),
    [
      props.onDelete,
      props.isPending,
      props.deletingSiteId,
      props.handleUpdateSiteName,
      props.isUpdatingName,
      props.updatingSiteNameId,
    ]
  );

  return (
    <PaginatedDataTable
      columns={columns}
      data={props.sites}
      noResultsText={t("grid.emptyStateTitle")}
      page={props.page}
      totalCount={props.totalCount}
      limit={props.limit}
      basePath={props.basePath}
      searchQuery={props.searchQuery}
      paginationTexts={props.paginationTexts} // <-- PROPAGACIÓN
    />
  );
}
// src/components/sites/SitesTable.tsx
