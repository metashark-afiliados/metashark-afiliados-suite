// src/components/sites/SitesTableColumns.tsx
/**
 * @file SitesTableColumns.tsx
 * @description Aparato de configuración de UI puro. Factoría que construye y
 *              devuelve la definición de columnas para la vista de tabla de sitios,
 *              reutilizando componentes soberanos para las celdas.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useFormatter, useTranslations } from "next-intl";

import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { Link } from "@/lib/navigation";
import { clientLogger } from "@/lib/logging";
import { SiteCardFooter } from "./SiteCardFooter";

interface GetSitesTableColumnsProps {
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  deletingSiteId: string | null;
}

/**
 * @public
 * @function getSitesTableColumns
 * @description Factoría de configuración pura. Construye y devuelve el array de
 *              definiciones de columna para la tabla de sitios.
 * @param {GetSitesTableColumnsProps} props - Dependencias para las celdas de acción.
 * @returns {ColumnDef<SiteWithCampaignCount>[]} El array de configuración de columnas.
 */
export const getSitesTableColumns = ({
  onDelete,
  isPending,
  deletingSiteId,
}: GetSitesTableColumnsProps): ColumnDef<SiteWithCampaignCount>[] => {
  const t = useTranslations("SitesPage");
  const format = useFormatter();

  clientLogger.trace(
    "[SitesTableColumns] Construyendo definiciones de columnas."
  );

  return [
    {
      accessorKey: "name",
      header: t("table.header_name"),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <Link
            href={{
              pathname: "/dashboard/sites/[siteId]/campaigns",
              params: { siteId: row.original.id },
            }}
            className="font-semibold hover:underline"
          >
            {row.original.name}
          </Link>
          <span className="text-xs text-muted-foreground font-mono">
            {row.original.subdomain}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "campaign_count",
      header: () => (
        <div className="text-center">{t("table.header_campaigns")}</div>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.original.campaign_count}</div>
      ),
    },
    {
      accessorKey: "updated_at",
      header: t("table.header_lastUpdated"),
      cell: ({ row }) =>
        format.dateTime(
          new Date(row.original.updated_at || row.original.created_at),
          "medium"
        ),
    },
    {
      id: "actions",
      header: () => (
        <div className="text-right">{t("table.header_actions")}</div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-end -mr-4">
          <SiteCardFooter
            site={row.original}
            onDelete={onDelete}
            isPending={isPending}
            deletingSiteId={deletingSiteId}
          />
        </div>
      ),
    },
  ];
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Definición de Vista de Tabla:** Este aparato establece la estructura para la nueva vista de tabla, un requisito fundamental para la mejora de UX.
 * 2. ((Implementada)) **Reutilización de Componentes (LEGO):** La celda de "Acciones" reutiliza el componente `SiteCardFooter`, demostrando una composición de élite y un cumplimiento estricto del principio DRY.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Cabeceras Ordenables:** Las cabeceras (`header`) podrían ser refactorizadas para renderizar un componente de botón que, al ser clickeado, invoque un `callback` para controlar el ordenamiento de los datos en `useSitesPage`.
 * 2. ((Vigente)) **Inline Editing:** El campo de nombre podría convertirse en un componente de edición en línea (similar al `WorkspaceTrigger`) para permitir la edición rápida sin navegar a otra página.
 *
 * =====================================================================
 */
// src/components/sites/SitesTableColumns.tsx
