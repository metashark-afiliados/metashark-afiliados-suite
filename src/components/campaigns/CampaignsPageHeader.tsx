// src/components/campaigns/CampaignsPageHeader.tsx
/**
 * @file CampaignsPageHeader.tsx
 * @description Orquestador de UI de élite para el encabezado de "Campañas".
 *              Consume el componente de layout abstracto `ResourcePageHeader`,
 *              delegando toda la lógica de layout y cumpliendo el principio DRY.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { type useTranslations } from "next-intl";
import React from "react";

import { ResourcePageHeader } from "@/components/shared/ResourcePageHeader";
import { type CampaignMetadata } from "@/lib/data/campaigns";
import { type SiteWithCampaignCount } from "@/lib/data/sites/types";
import { clientLogger } from "@/lib/logger";
import { CampaignsHeaderActions } from "./CampaignsHeaderActions";
import { CampaignsPageTitle } from "./CampaignsPageTitle";

type TFunction = ReturnType<typeof useTranslations>;
type SiteInfo = Pick<SiteWithCampaignCount, "id" | "name" | "subdomain">;
type CampaignStatus = "draft" | "published" | "archived";
type SortByOption = "updated_at_desc" | "name_asc";

export interface CampaignsPageHeaderProps {
  t: TFunction;
  site: SiteInfo;
  handleCreate: (
    formData: FormData,
    optimisticItem: Omit<CampaignMetadata, "id">
  ) => void;
  isPending: boolean;
  mutatingId: string | null;
  statusFilter?: CampaignStatus | "all";
  onStatusChange: (status: CampaignStatus | "all") => void;
  sortBy: SortByOption;
  onSortChange: (sort: SortByOption) => void;
}

/**
 * @public
 * @component CampaignsPageHeader
 * @description Orquesta y ensambla la UI del encabezado de la página de campañas.
 *              Delega la lógica de layout al componente genérico `ResourcePageHeader`,
 *              actuando como un ensamblador puro que compone sus aparatos hijos.
 * @param {CampaignsPageHeaderProps} props - Propiedades para configurar el encabezado.
 * @returns {React.ReactElement}
 */
export function CampaignsPageHeader({
  site,
  ...props
}: CampaignsPageHeaderProps): React.ReactElement {
  clientLogger.trace(
    "[CampaignsPageHeader] Renderizando orquestador de UI consumiendo abstracción."
  );

  return (
    <ResourcePageHeader
      titleSlot={<CampaignsPageTitle site={site} />}
      actionsSlot={<CampaignsHeaderActions site={site} {...props} />}
    />
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Hook `useCampaignsHeader`**: ((Vigente)) Para una pureza de élite, la gestión de las numerosas props de este componente podría ser encapsulada en un hook `useCampaignsHeader`. Este hook proveería los datos y callbacks a través de un contexto, simplificando la firma del componente y desacoplándolo aún más.
 * 2. **Integración de Breadcrumbs**: ((Vigente)) El `ResourcePageHeader` acepta un `breadcrumbsSlot`. Este componente podría ser mejorado para construir y pasar un componente `Breadcrumbs` dinámico, mostrando la ruta completa "Dashboard / Sites / {siteName}".
 * =====================================================================
 */
// src/components/campaigns/CampaignsPageHeader.tsx
