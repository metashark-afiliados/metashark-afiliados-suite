// src/components/campaigns/CampaignsTableColumns.tsx
/**
 * @file src/components/campaigns/CampaignsTableColumns.tsx
 * @description Aparato atómico y puro. Genera la configuración de columnas
 *              (`ColumnDef[]`) para la tabla de campañas. Ha sido refactorizado
 *              para consumir el componente `ConfirmationDialogContent` y gestionar
 *              su propio estado de diálogo.
 * @author Raz Podestá
 * @version 3.0.0
 */
"use client";

import { type useFormatter, type useTranslations } from "next-intl";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Archive,
  Copy,
  Edit,
  MoreHorizontal,
  PieChart,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationDialogContent } from "@/components/ui/ConfirmationDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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

// ... (types y map sin cambios) ...
type TFunction = ReturnType<typeof useTranslations>;
type TFormatter = ReturnType<typeof useFormatter>;
type CampaignStatus = "draft" | "published" | "archived";

const statusVariantMap: Record<CampaignStatus, BadgeProps["variant"]> = {
  published: "default",
  archived: "secondary",
  draft: "outline",
};

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

export const getCampaignsColumns = ({
  /* ... (props sin cambios) ... */ t,
  tDialogs,
  format,
  handleDelete,
  handleDuplicate,
  handleArchive,
  isPending,
  mutatingId,
  toastTexts,
}: GetCampaignsColumnsParams): ColumnDef<CampaignMetadata>[] => [
  // ... (columnas 'name', 'status', 'updated_at' sin cambios)...
  {
    accessorKey: "name",
    header: t("table.header_name"),
    cell: ({ row }) => (
      <Link
        href={{
          pathname: "/builder/[campaignId]",
          params: { campaignId: row.original.id },
        }}
        className="font-medium hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: t("table.header_status"),
    cell: ({ row }) => {
      const status = (row.original.status as CampaignStatus) || "draft";
      return (
        <Badge
          variant={statusVariantMap[status]}
          className={cn(
            status === "published" &&
              "bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-400"
          )}
        >
          {t(`status.${status}` as any)}
        </Badge>
      );
    },
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
    header: () => <div className="text-right">{t("table.header_actions")}</div>,
    cell: function Cell({ row }) {
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

      const handleDeleteConfirm = (formData: FormData) => {
        handleDelete(formData);
      };

      return (
        <div className="text-right">
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
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
                  onClick={() => handleDuplicate(row.original.id)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  <span>{t("table.action_duplicate")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleArchive(row.original.id)}
                >
                  <Archive className="mr-2 h-4 w-4" />
                  <span>{t("table.action_archive")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <PieChart className="mr-2 h-4 w-4" />
                  <span>{t("table.action_analytics")}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>{t("table.action_delete")}</span>
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <ConfirmationDialogContent
              icon={ShieldAlert}
              title={t("deleteDialog.title")}
              description={t.rich("deleteDialog.description", {
                campaignName: row.original.name,
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
              confirmButtonText={t("deleteDialog.confirmButton")}
              cancelButtonText={tDialogs("generic_cancelButton")}
              onConfirm={handleDeleteConfirm}
              onClose={() => setIsDeleteDialogOpen(false)}
              isPending={isPending && mutatingId === row.original.id}
              hiddenInputs={{ campaignId: row.original.id }}
              confirmationText={row.original.name}
              confirmationLabel={t.rich("deleteDialog.confirmation_label", {
                campaignName: row.original.name,
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            />
          </Dialog>
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
 * 1. **Sincronización de Contrato de Módulo**: ((Implementada)) Se ha actualizado la importación a `ConfirmationDialogContent` y la celda de acciones ahora gestiona su propio estado de diálogo.
 *
 * =====================================================================
 */
// src/components/campaigns/CampaignsTableColumns.tsx
