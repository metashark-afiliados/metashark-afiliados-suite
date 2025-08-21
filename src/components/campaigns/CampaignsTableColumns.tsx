// src/components/campaigns/CampaignsTableColumns.tsx
/**
 * @file CampaignsTableColumns.tsx
 * @description Aparato de configuración puro y ensamblador. Su única
 *              responsabilidad es definir la estructura de las columnas y
 *              delegar el renderizado de cada celda a sus componentes atómicos
 *              correspondientes, siguiendo la "Filosofía LEGO" al más alto nivel.
 * @author Raz Podestá
 * @version 4.0.0
 */
import { type useFormatter, type useTranslations } from "next-intl";
import { type ColumnDef } from "@tanstack/react-table";
import React from "react";

import { type CampaignMetadata } from "@/lib/data/campaigns";
import {
  CampaignActionsCell,
  CampaignNameLink,
  CampaignStatusBadge,
} from "./cells";

/**
 * @public
 * @interface GetCampaignsColumnsParams
 * @description Contrato de props para la factoría de columnas. Define todas las
 *              dependencias (funciones de traducción, manejadores de acciones, estado)
 *              que se pasarán a los componentes de celda atómicos.
 */
export interface GetCampaignsColumnsParams {
  t: ReturnType<typeof useTranslations>;
  tDialogs: ReturnType<typeof useTranslations>;
  format: ReturnType<typeof useFormatter>;
  handleDelete: (formData: FormData) => void;
  handleDuplicate: (campaignId: string) => void;
  handleArchive: (campaignId: string) => void;
  isPending: boolean;
  mutatingId: string | null;
  toastTexts: {
    duplicating: string;
    archiving: string;
  };
}

/**
 * @public
 * @function getCampaignsColumns
 * @description Factoría de configuración pura. Construye y devuelve el array de
 *              definiciones de columna para la tabla de campañas.
 * @param {GetCampaignsColumnsParams} props - Las dependencias necesarias para las celdas.
 * @returns {ColumnDef<CampaignMetadata>[]} El array de configuración de columnas.
 */
export const getCampaignsColumns = (
  props: GetCampaignsColumnsParams
): ColumnDef<CampaignMetadata>[] => [
  {
    accessorKey: "name",
    header: props.t("table.header_name"),
    cell: ({ row }) => <CampaignNameLink campaign={row.original} />,
  },
  {
    accessorKey: "status",
    header: props.t("table.header_status"),
    cell: ({ row }) => (
      <CampaignStatusBadge status={row.original.status as any} t={props.t} />
    ),
  },
  {
    accessorKey: "updated_at",
    header: props.t("table.header_lastUpdated"),
    cell: ({ row }) =>
      props.format.dateTime(
        new Date(row.original.updated_at || row.original.created_at),
        "medium"
      ),
  },
  {
    id: "actions",
    header: () => (
      <div className="text-right">{props.t("table.header_actions")}</div>
    ),
    cell: ({ row }) => (
      <CampaignActionsCell campaign={row.original} {...props} />
    ),
  },
];

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Ensamblaje Puro (SRP)**: ((Implementada)) Este aparato ya no contiene lógica de UI ni de estado. Su única responsabilidad es definir la estructura de la tabla y delegar el renderizado de las celdas a componentes atómicos, cumpliendo con el Principio de Responsabilidad Única.
 * 2. **Cohesión y Desacoplamiento**: ((Implementada)) La lógica de la UI de las celdas (enlaces, badges, menús de acción) está ahora completamente desacoplada de la definición de la tabla, lo que permite probar y modificar cada pieza de forma aislada.
 *
 * @subsection Melhorias Futuras
 * 1. **Cabeceras de Tabla Interactivas**: ((Vigente)) Los `header` podrían ser refactorizados para renderizar componentes que incluyan indicadores de ordenamiento o campos de filtro, pasando los callbacks correspondientes a través del contrato `GetCampaignsColumnsParams`.
 * 2. **Compatibilidad con Virtualización**: ((Vigente)) Esta estructura de definición de columnas es 100% compatible con librerías de virtualización como `@tanstack/react-virtual`, una futura optimización de rendimiento para tablas con un gran número de filas.
 * =====================================================================
 */
// src/components/campaigns/CampaignsTableColumns.tsx
