// src/components/sites/SitesTable.tsx
/**
 * @file SitesTable.tsx
 * @description Aparato de UI de ensamblaje puro y de presentación. Su única
 *              responsabilidad es componer el `PaginatedDataTable` con la
 *              configuración de columnas específica para la entidad 'sites',
 *              obtenida de la factoría `getSitesTableColumns`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useFormatter, useTranslations } from "next-intl";

import { PaginatedDataTable } from "@/components/shared/PaginatedDataTable";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { clientLogger } from "@/lib/logging";
import { getSitesTableColumns } from "./SitesTableColumns";

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
  searchQuery?: string;
}

/**
 * @public
 * @component SitesTable
 * @description Renderiza la vista de tabla para la página "Mis Sitios".
 * @param {SitesTableProps} props - Propiedades para configurar la tabla.
 * @returns {React.ReactElement}
 */
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
    />
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Novas
 * 1. **Filtros en Cabecera de Tabla**: ((Vigente)) Para una UX de élite, las cabeceras de la tabla (`TableHead`) podrían ser interactivas, permitiendo al usuario hacer clic para ordenar los datos por esa columna. Esto requeriría pasar callbacks de ordenamiento a `getSitesTableColumns`.
 * 2. **Acciones en Lote (Bulk Actions)**: ((Vigente)) Se podría añadir una columna de `Checkbox` a la tabla, permitiendo la selección de múltiples sitios para realizar acciones en lote, como "Archivar Seleccionados" o "Eliminar Seleccionados".
 *
 * =====================================================================
 */
// src/components/sites/SitesTable.tsx
