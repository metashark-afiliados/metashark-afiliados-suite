/**
 * @author Raz Podestá - MetaShark Tech
 * @version 8.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

import { EditableText } from "@/components/builder/ui/EditableText";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CardHeader as CardHeaderPrimitive,
  CardTitle,
} from "@/components/ui/card";
import { type SiteWithCampaignCount } from "@/lib/data/sites/types";
import { useSitesPageTranslations } from "@/lib/hooks/i18n/useSitesPageTranslations";
import { clientLogger } from "@/lib/logging";
import { Link } from "@/lib/navigation";
import { protocol, rootDomain } from "@/lib/utils";
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

/**
 * @public
 * @component SiteCardHeader
 * @description Renderiza la cabecera de una tarjeta de sitio, incluyendo el nombre
 *              del sitio (ahora editable en línea), el subdominio y botones de acción.
 * @param {SiteCardHeaderProps} props - Propiedades para configurar la cabecera de la tarjeta.
 * @returns {React.ReactElement}
 */
export function SiteCardHeader({
  site,
  onDelete,
  isPending,
  deletingSiteId,
  handleUpdateSiteName,
  isUpdatingName,
  updatingSiteNameId,
}: SiteCardHeaderProps): React.ReactElement {
  clientLogger.trace(`[SiteCardHeader] Renderizando para sitio: ${site.id}`);
  const { tSitesPage } = useSitesPageTranslations();

  const siteUrl = `${protocol}://${site.subdomain}.${rootDomain}`;
  const isThisSiteNameUpdating =
    isUpdatingName && updatingSiteNameId === site.id;

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
            className="text-lg font-semibold truncate hover:underline cursor-pointer"
            placeholder={tSitesPage("card.emptySiteNamePlaceholder")}
            // La prop `disabled` se maneja internamente en EditableText.
            // Para deshabilitar la edición, controlamos `onDoubleClick`.
            onDoubleClick={
              isThisSiteNameUpdating ? (e) => e.preventDefault() : undefined
            }
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
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </CardHeaderPrimitive>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Selector de Iconos para el Sitio**: ((Vigente)) El `AvatarFallback` podría ser un `EditableIcon` que, al hacer clic, abra un selector de emojis o una `AssetLibrary` para cambiar el icono del sitio.
 *
 * =====================================================================
 */
