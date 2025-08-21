// src/components/sites/SiteCard.tsx
import React from "react";

import { Card as CardPrimitive } from "@/components/ui/card";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { SiteCardFooter } from "./SiteCardFooter";
import { SiteCardHeader } from "./SiteCardHeader";

export interface SiteCardTexts {
  campaignCount: (count: number) => string;
  manageCampaignsButton: string;
  deleteSiteAriaLabel: (subdomain: string) => string;
  openSiteAriaLabel: string;
  popoverTitle: string;
  popoverDescription: string;
}

export interface DeleteSiteDialogTexts {
  title: string;
  description: (subdomain: string) => React.ReactNode;
  confirmButton: string;
  cancelButton: string;
  confirmationLabel: (subdomain: string) => React.ReactNode;
}

interface SiteCardProps {
  site: SiteWithCampaignCount;
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  deletingSiteId: string | null;
  texts: SiteCardTexts;
  deleteDialogTexts: DeleteSiteDialogTexts;
}

/**
 * @public
 * @component SiteCard
 * @description Orquestador de UI puro que ensambla una tarjeta de sitio
 *              a partir de los átomos `SiteCardHeader` y `SiteCardFooter`.
 * @param {SiteCardProps} props - Propiedades para configurar la tarjeta.
 * @returns {React.ReactElement}
 * @version 3.0.0
 * @author Raz Podestá
 */
export function SiteCard({
  site,
  onDelete,
  isPending,
  deletingSiteId,
  texts,
  deleteDialogTexts,
}: SiteCardProps): React.ReactElement {
  return (
    <CardPrimitive className="flex flex-col justify-between h-full transition-all hover:border-primary/50 hover:shadow-lg">
      <SiteCardHeader
        name={site.name}
        campaignCountText={texts.campaignCount(site.campaign_count)}
        popoverTitle={texts.popoverTitle}
        popoverDescription={texts.popoverDescription}
      />
      <SiteCardFooter
        site={site}
        onDelete={onDelete}
        isPending={isPending}
        deletingSiteId={deletingSiteId}
        texts={texts}
        deleteDialogTexts={deleteDialogTexts}
      />
    </CardPrimitive>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Hiper-Atomicidad (Orquestador Puro)**: ((Implementada)) El componente ahora es un ensamblador puro que solo compone `SiteCardHeader` y `SiteCardFooter`.
 *
 * @subsection Melhorias Futuras
 * 1. **Propagación de `children`**: ((Vigente)) El componente podría aceptar `children` para renderizar contenido personalizado en el cuerpo de la tarjeta.
 *
 * =====================================================================
 */
