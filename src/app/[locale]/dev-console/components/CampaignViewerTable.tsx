// src/app/[locale]/dev-console/components/CampaignViewerTable.tsx
/**
 * @file CampaignViewerTable.tsx
 * @description Componente de cliente para la tabla del visor de campañas del Dev Console.
 *              Renderiza los datos de las campañas y proporciona una acción para
 *              inspeccionar el contenido JSON en un diálogo modal.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";
import { useFormatter, useTranslations } from "next-intl";

import { type CampaignWithSiteInfo } from "@/lib/data/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CampaignRow = CampaignWithSiteInfo;

export function CampaignViewerTable({
  campaigns,
}: {
  campaigns: CampaignRow[];
}) {
  const t = useTranslations("app.dev-console.CampaignsTable");
  const format = useFormatter();

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("header_name")}</TableHead>
            <TableHead>{t("header_site")}</TableHead>
            <TableHead>{t("header_created")}</TableHead>
            <TableHead>{t("header_updated")}</TableHead>
            <TableHead className="text-right">{t("header_actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell className="font-medium">{campaign.name}</TableCell>
              <TableCell>{campaign.sites?.subdomain || "N/A"}</TableCell>
              <TableCell>
                {format.dateTime(new Date(campaign.created_at), "medium")}
              </TableCell>
              <TableCell>
                {campaign.updated_at
                  ? format.dateTime(new Date(campaign.updated_at), "medium")
                  : "Never"}
              </TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!campaign.content}
                    >
                      {t("action_view_json")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>
                        {t("dialog_title", { campaignName: campaign.name })}
                      </DialogTitle>
                    </DialogHeader>
                    <pre className="mt-2 w-full rounded-lg bg-muted p-4 text-xs overflow-auto max-h-[60vh]">
                      {JSON.stringify(campaign.content, null, 2)}
                    </pre>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad (SRP)**: ((Implementada)) Componente de presentación puro que encapsula la renderización de la tabla de campañas.
 * 2. **Full Internacionalización**: ((Implementada)) Todos los textos se consumen desde la capa de i18n.
 *
 * @subsection Melhorias Futuras
 * 1. **Paginación y Búsqueda**: ((Vigente)) Integrar este componente con `@tanstack/react-table` para añadir paginación, búsqueda y ordenamiento del lado del cliente, mejorando la usabilidad para un gran número de campañas.
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/components/CampaignViewerTable.tsx
