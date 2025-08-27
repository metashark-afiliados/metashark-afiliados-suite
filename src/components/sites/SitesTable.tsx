// src/components/sites/SitesTable.tsx
/**
 * @file SitesTable.tsx
 * @description Componente de ensamblaje soberano y memoizado para la vista de
 *              tabla de sitios. Consume la factoría de columnas y orquesta el
 *              componente `DataTable` genérico.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { DataTable } from "@/components/shared/data-table";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { clientLogger } from "@/lib/logging";
import { getSitesTableColumns } from "./SitesTableColumns";

interface SitesTableProps {
  sites: SiteWithCampaignCount[];
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  deletingSiteId: string | null;
}

const SitesTableComponent = ({
  sites,
  onDelete,
  isPending,
  deletingSiteId,
}: SitesTableProps) => {
  clientLogger.trace("[SitesTable] Renderizando componente de tabla soberano.");
  const t = useTranslations("SitesPage");

  const columns = React.useMemo(
    () => getSitesTableColumns({ onDelete, isPending, deletingSiteId }),
    [onDelete, isPending, deletingSiteId]
  );

  return (
    <DataTable
      columns={columns}
      data={sites}
      noResultsText={t("grid.emptyStateTitle")}
    />
  );
};

export const SitesTable = React.memo(SitesTableComponent);
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Memoización de Rendimiento:** El componente ahora está envuelto en `React.memo`. Junto con la memoización de `SitesGrid`, esto completa la optimización de rendimiento de los componentes de vista, previniendo re-renderizados innecesarios.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Selección de Filas y Acciones en Lote:** Integrar la funcionalidad de selección de filas de `@tanstack/react-table` para permitir acciones en lote, como "Archivar Seleccionados" o "Eliminar Seleccionados".
 * 2. ((Vigente)) **Filtros por Columna:** Añadir inputs de filtro en las cabeceras de la tabla (`<TableHead>`) para permitir al usuario filtrar los datos directamente en cada columna, proporcionando una experiencia de gestión de datos de nivel de escritorio.
 *
 * =====================================================================
 */
// src/components/sites/SitesTable.tsx
