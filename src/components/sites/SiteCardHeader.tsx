// src/components/sites/SiteCardHeader.tsx
/**
 * @file SiteCardHeader.tsx
 * @description Componente soberano para la cabecera de SiteCard. Refactorizado
 *              para consumir la SSoT de configuración correcta (`site.config.ts`),
 *              resolviendo el error de importación TS2305.
 * @author L.I.A. Legacy
 * @version 8.1.0
 */
"use client";

import { ExternalLink, Trash2 } from "lucide-react";
import React from "react";

import { EditableText } from "@/components/builder/ui/EditableText";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardHeader as CardHeaderPrimitive } from "@/components/ui/card";
import { protocol, rootDomain } from "@/config/site.config"; // <-- RUTA CORREGIDA
import { type SiteWithCampaignCount } from "@/lib/data/sites/types";
import { useSitesPageTranslations } from "@/lib/hooks/i18n/useSitesPageTranslations";
import { clientLogger } from "@/lib/logger";
import { Link } from "@/lib/navigation";
import { DeleteSiteDialog } from "./DeleteSiteDialog";

export interface SiteCardHeaderProps {
  site: SiteWithCampaignCount;
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  deletingSiteId: string | null;
  handleUpdateSiteName: (siteId: string, newName: string) => Promise<void>;
  isUpdatingName: boolean;
  updatingSiteNameId: string | null;
}

export function SiteCardHeader({
  site,
  onDelete,
  isPending,
  deletingSiteId,
  handleUpdateSiteName,
  isUpdatingName,
  updatingSiteNameId,
}: SiteCardHeaderProps): React.ReactElement {
  const { tSitesPage } = useSitesPageTranslations();
  const siteUrl = `${protocol}://${site.subdomain}.${rootDomain}`;
  const isThisSiteNameUpdating =
    isUpdatingName && updatingSiteNameId === site.id;

  clientLogger.trace(`[SiteCardHeader] Renderizando para sitio: ${site.id}`);

  return (
    <CardHeaderPrimitive className="flex-row items-start justify-between gap-4">
      <Link
        href={{
          pathname: "/dashboard/sites/[siteId]/campaigns",
          params: { siteId: site.id },
        }}
        className="flex items-center gap-4 group"
      >
        <Avatar>
          <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            {site.icon || site.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <EditableText
            tag="h3"
            value={site.name || tSitesPage("card.emptySiteNamePlaceholder")}
            onSave={(newName) => handleUpdateSiteName(site.id, newName)}
            className="text-lg font-semibold truncate hover:underline"
            placeholder={tSitesPage("card.emptySiteNamePlaceholder")}
            disabled={isThisSiteNameUpdating}
          />
          <p className="text-sm text-muted-foreground font-mono">
            {site.subdomain}
          </p>
        </div>
      </Link>

      <div className="flex items-center -mr-2">
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={tSitesPage("card.openSiteAriaLabel", {
            subdomain: site.subdomain,
          })}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={(e) => e.stopPropagation()}
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
    </CardHeaderPrimitive>
  );
}
// src/components/sites/SiteCardHeader.tsx
