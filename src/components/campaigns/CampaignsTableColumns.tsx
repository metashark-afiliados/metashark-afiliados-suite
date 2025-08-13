/**
 * @file src/components/campaigns/CampaignsTableColumns.tsx
 * @description Aparato atómico y puro de élite. Genera la configuración de columnas
 *              (`ColumnDef[]`) para la tabla de campañas. Ha sido nivelado para
 *              incluir una columna de estado visual y un menú de acciones contextuales
 *              avanzado, y para resolver una regresión de linting (TS2367) mediante
 *              la abstracción de lógica.
 * @author Raz Podestá
 * @version 2.2.1
 */
"use client";

import { type useFormatter, type useTranslations } from "next-intl";
import { type ColumnDef, type Row } from "@tanstack/react-table";
import {
  Archive,
  Copy,
  Edit,
  MoreHorizontal,
  PieChart,
  ShieldAlert,
  Trash2,
} from "lucide-react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type CampaignMetadata } from "@/lib/data/campaigns";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type TFunction = ReturnType<typeof useTranslations>;
type TFormatter = ReturnType<typeof useFormatter>;
type CampaignStatus = "draft" | "published" | "archived";
type CampaignWithStatus = CampaignMetadata & {
  status?: CampaignStatus;
};

/**
 * @private
 * @function getStatusVariant
 * @description Helper puro para mapear un estado de campaña a una variante de estilo del Badge.
 * @param {CampaignStatus} status - El estado de la campaña.
 * @returns {BadgeProps["variant"]} La variante de Badge correspondiente.
 */
const getStatusVariant = (status: CampaignStatus): BadgeProps["variant"] => {
  switch (status) {
    case "published":
      return "default";
    case "archived":
      return "secondary";
    case "draft":
    default:
      return "outline";
  }
};

/**
 * @public
 * @interface GetCampaignsColumnsParams
 * @description Define el contrato de dependencias para la función generadora de columnas.
 */
export interface GetCampaignsColumnsParams {
  t: TFunction;
  tDialogs: TFunction;
  format: TFormatter;
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
 * @exports getCampaignsColumns
 * @description Genera la definición de columnas para el DataTable de campañas.
 * @param {GetCampaignsColumnsParams} params - Dependencias necesarias.
 * @returns {ColumnDef<CampaignWithStatus>[]}
 */
export const getCampaignsColumns = ({
  t,
  tDialogs,
  format,
  handleDelete,
  handleDuplicate,
  handleArchive,
  isPending,
  mutatingId,
}: GetCampaignsColumnsParams): ColumnDef<CampaignWithStatus>[] => [
  {
    accessorKey: "name",
    header: t("table.header_name"),
  },
  {
    accessorKey: "status",
    header: t("table.header_status"),
    cell: ({ row }: { row: Row<CampaignWithStatus> }) => {
      const status = row.original.status || "draft";
      const statusText = t(`status.${status}` as any);
      return (
        <Badge
          variant={getStatusVariant(status)} // <-- Lógica Abstraída y Corregida
          className={cn(
            status === "published" &&
              "bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-400"
          )}
        >
          {statusText}
        </Badge>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: t("table.header_lastUpdated"),
    cell: ({ row }: { row: Row<CampaignWithStatus> }) =>
      format.dateTime(
        new Date(row.original.updated_at || row.original.created_at),
        "medium"
      ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">{t("table.header_actions")}</div>,
    cell: ({ row }: { row: Row<CampaignWithStatus> }) => {
      const handleDuplicateClick = () => handleDuplicate(row.original.id);
      const handleArchiveClick = () => handleArchive(row.original.id);

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  href={{
                    pathname: "/builder/[campaignId]",
                    params: { campaignId: row.original.id },
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span>{t("table.action_edit")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleDuplicateClick}
                className="cursor-pointer"
              >
                <Copy className="mr-2 h-4 w-4" />
                <span>{t("table.action_duplicate")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleArchiveClick}
                className="cursor-pointer"
              >
                <Archive className="mr-2 h-4 w-4" />
                <span>{t("table.action_archive")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="cursor-not-allowed">
                <PieChart className="mr-2 h-4 w-4" />
                <span>{t("table.action_analytics")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ConfirmationDialog
                triggerButton={
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>{t("table.action_delete")}</span>
                  </DropdownMenuItem>
                }
                icon={ShieldAlert}
                title={t("deleteDialog.title")}
                description={t.rich("deleteDialog.description", {
                  campaignName: row.original.name,
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
                confirmButtonText={t("deleteDialog.confirmButton")}
                cancelButtonText={tDialogs("generic_cancelButton")}
                onConfirm={handleDelete}
                isPending={isPending && mutatingId === row.original.id}
                confirmationText={row.original.name}
                confirmationLabel={t.rich("deleteDialog.confirmation_label", {
                  campaignName: row.original.name,
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Abstracción de Lógica**: ((Implementada)) Se ha restaurado la función `getStatusVariant` para resolver el error de linting `TS2367` y mejorar la legibilidad. Cero regresiones.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente de Celda de Acciones Atómico**: ((Vigente)) La lógica de la celda de acciones sigue siendo un candidato ideal para ser abstraída a su propio sub-componente.
 *
 * =====================================================================
 */
