/**
 * @file CampaignViewerTable.tsx
 * @description Componente de cliente para la tabla del visor de campañas del Dev Console.
 *              Ha sido refactorizado para alinearse con la nueva arquitectura de
 *              datos, mostrando únicamente los metadatos de la campaña, ya que
 *              el contenido (`content`) ahora reside en la entidad `creations`.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useFormatter, useTranslations } from "next-intl";

import { type CampaignWithSiteInfo } from "@/lib/data/admin";
import { Card } from "@/components/ui/card";
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
 * 1. **Alineación Arquitectónica**: ((Implementada)) Se ha eliminado la columna "Acciones" y la funcionalidad "Ver JSON". Esta refactorización alinea el componente con la nueva SSoT del modelo de datos, donde `campaigns` solo contiene metadatos.
 * 2. **Resolución de Error de Compilación (TS2339)**: ((Implementada)) La eliminación del código que accedía a la propiedad `campaign.content` inexistente resuelve los errores de tipo.
 *
 * @subsection Melhorias Futuras
 * 1. **Paginación y Búsqueda**: ((Vigente)) Integrar este componente con `@tanstack/react-table` para añadir paginación, búsqueda y ordenamiento del lado del cliente, mejorando la usabilidad para un gran número de campañas.
 * 2. **Visor de `Creations`**: ((Vigente)) Crear un nuevo visor en el Dev Console dedicado a la tabla `creations`, que sí incluirá una funcionalidad para inspeccionar el contenido JSON de los diseños.
 *
 * =====================================================================
 */
