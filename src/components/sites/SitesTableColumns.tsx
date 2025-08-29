// src/components/sites/SitesTableColumns.tsx
/**
 * @file SitesTableColumns.tsx
 * @description Aparato de configuración de UI puro. Factoría que construye y
 *              devuelve la definición de columnas para la vista de tabla de sitios,
 *              reutilizando componentes soberanos para las celdas.
 *              **Actualizado para integrar `EditableText` en la columna del nombre del sitio.**
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useFormatter, useTranslations } from "next-intl";

import { EditableText } from "@/components/builder/ui/EditableText";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { clientLogger } from "@/lib/logging";
import { SiteCardFooter } from "./SiteCardFooter";

/**
 * @public
 * @interface GetSitesTableColumnsProps
 * @description Contrato de props para la factoría de columnas. Define todas las
 *              dependencias (funciones de traducción, manejadores de acciones, estado)
 *              que se pasarán a los componentes de celda atómicos.
 */
export interface GetSitesTableColumnsProps {
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  deletingSiteId: string | null;
  handleUpdateSiteName: (siteId: string, newName: string) => Promise<void>;
  isUpdatingName: boolean;
  updatingSiteNameId: string | null;
}

/**
 * @public
 * @function getSitesTableColumns
 * @description Factoría de configuración pura. Construye y devuelve el array de
 *              definiciones de columna para la tabla de sitios.
 *              **Ahora incluye `EditableText` para el nombre del sitio.**
 * @param {GetSitesTableColumnsProps} props - Dependencias para las celdas de acción y edición.
 * @returns {ColumnDef<SiteWithCampaignCount>[]} El array de configuración de columnas.
 */
export const getSitesTableColumns = ({
  onDelete,
  isPending,
  deletingSiteId,
  handleUpdateSiteName,
  isUpdatingName,
  updatingSiteNameId,
}: GetSitesTableColumnsProps): ColumnDef<SiteWithCampaignCount>[] => {
  const t = useTranslations("SitesPage");
  const format = useFormatter();

  clientLogger.trace(
    "[SitesTableColumns] Construyendo definiciones de columnas con EditableText."
  );

  return [
    {
      accessorKey: "name",
      header: t("table.header_name"),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <EditableText
            tag="p"
            value={row.original.name || t("card.emptySiteNamePlaceholder")}
            onSave={(newName) => handleUpdateSiteName(row.original.id, newName)}
            className="font-semibold text-lg hover:underline cursor-pointer"
            placeholder={t("card.emptySiteNamePlaceholder")}
            disabled={isUpdatingName && updatingSiteNameId === row.original.id}
          />
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
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Novas
 * 1. **Edición en Línea del Subdominio**: ((Vigente)) La columna `subdomain` también podría ser un candidato para `EditableText` con validación de disponibilidad en tiempo real (similar a `SubdomainInput`), pero esto es una funcionalidad más compleja que requiere su propia Server Action.
 * 2. **Cabeceras Ordenables**: ((Vigente)) Las cabeceras (`header`) podrían ser refactorizadas para renderizar un componente de botón que, al ser clickeado, invoque un `callback` para controlar el ordenamiento de los datos en `useSitesPage`.
 *
 * =====================================================================
 */
// src/components/sites/SitesTableColumns.tsx
