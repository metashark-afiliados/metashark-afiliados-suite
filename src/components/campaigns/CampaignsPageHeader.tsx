// src/components/campaigns/CampaignsPageHeader.tsx
/**
 * @file CampaignsPageHeader.tsx
 * @description Orquestador de UI de élite para el encabezado de "Campañas".
 *              Ha sido refactorizado holísticamente para consumir el componente
 *              de layout abstracto `ResourcePageHeader`, delegando toda la
 *              lógica de layout y cumpliendo el principio DRY al más alto nivel.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { type useTranslations } from "next-intl";

import { type CampaignMetadata } from "@/lib/data/campaigns";
import { type SiteWithCampaignCount } from "@/lib/data/sites/types";
import { clientLogger } from "@/lib/logging";
import { ResourcePageHeader } from "@/components/shared/ResourcePageHeader";
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
  statusFilter?: CampaignStatus;
  onStatusChange: (status: CampaignStatus | "all") => void;
  sortBy: SortByOption;
  onSortChange: (sort: SortByOption) => void;
}

/**
 * @public
 * @component CampaignsPageHeader
 * @description Orquesta y ensambla la UI del encabezado de la página de campañas.
 *              Delega la lógica de layout al componente genérico `ResourcePageHeader`,
 *              actuando como un ensamblador puro que compone sus aparatos hijos
 *              (`CampaignsPageTitle` y `CampaignsHeaderActions`).
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
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Adopción de Abstracción de Layout (DRY)**: ((Implementada)) El componente ahora consume `ResourcePageHeader`, delegando toda la lógica de layout (`flex`, `justify-between`, etc.) al componente abstracto. Esto hace que `CampaignsPageHeader` sea un orquestador de composición puro, más simple y declarativo.
 * 2. **Simplificación Radical**: ((Implementada)) El JSX del componente se ha reducido a su mínima expresión, mejorando drásticamente la legibilidad y la mantenibilidad, y garantizando una consistencia visual con otros encabezados de página como `SitesHeader`.
 *
 * @subsection Melhorias Futuras
 * 1. **Hook `useCampaignsHeader`**: ((Vigente)) Para una pureza de élite, la gestión de las numerosas props de este componente podría ser encapsulada en un hook `useCampaignsHeader`. Este hook proveería los datos y callbacks a través de un contexto, simplificando la firma del componente y desacoplándolo aún más. Propondré esta refactorización si la complejidad de las props aumenta.
 *
 * =====================================================================
 */
// src/components/campaigns/CampaignsPageHeader.tsx
