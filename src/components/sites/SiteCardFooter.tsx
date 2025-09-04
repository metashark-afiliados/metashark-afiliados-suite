// src/components/sites/SiteCardFooter.tsx
/**
 * @file SiteCardFooter.tsx
 * @description Componente de presentación soberano. Refactorizado para
 *              consumir el hook de i18n de su dominio (`useSitesPageTranslations`),
 *              resolviendo un error de compilación crítico y reforzando la
 *              arquitectura de componentes soberanos.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 4.0.0
 */
"use client";

import { ExternalLink } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { CardFooter as CardFooterPrimitive } from "@/components/ui/card";
import { protocol, rootDomain } from "@/config/site.config";
import { type SiteWithCampaignCount } from "@/lib/data/sites/types";
import { useSitesPageTranslations } from "@/lib/hooks/i18n/useSitesPageTranslations";
import { clientLogger } from "@/lib/logger";
import { Link } from "@/lib/navigation";
import { DeleteSiteDialog } from "./DeleteSiteDialog";

export interface SiteCardFooterProps {
  site: SiteWithCampaignCount;
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  deletingSiteId: string | null;
}

export function SiteCardFooter({
  site,
  onDelete,
  isPending,
  deletingSiteId,
}: SiteCardFooterProps): React.ReactElement {
  clientLogger.trace(`[SiteCardFooter] Renderizando para sitio: ${site.id}`);

  // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA (I18N) ---
  const { tSitesPage } = useSitesPageTranslations();
  // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---

  return (
    <CardFooterPrimitive className="justify-between">
      <Button variant="outline" asChild>
        <Link
          href={{
            pathname: "/dashboard/sites/[siteId]/campaigns",
            params: { siteId: site.id },
          }}
        >
          {tSitesPage("card.manageCampaignsButton")}
        </Link>
      </Button>
      <div className="flex items-center gap-1">
        <a
          href={`${protocol}://${site.subdomain}.${rootDomain}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label={tSitesPage("card.openSiteAriaLabel")}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
        <DeleteSiteDialog
          site={site}
          onDelete={onDelete}
          isPending={isPending && deletingSiteId === site.id}
        />
      </div>
    </CardFooterPrimitive>
  );
}
// src/components/sites/SiteCardFooter.tsx
