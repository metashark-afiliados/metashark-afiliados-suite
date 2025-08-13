// src/components/sites/SiteCard.tsx
/**
 * @file src/components/sites/SiteCard.tsx
 * @description Componente de presentación atómico para una tarjeta de sitio.
 *              Ha sido reconstruido para resolver violaciones de accesibilidad
 *              (nested-interactive), desacoplando las zonas interactivas y
 *              asegurando que cada acción del usuario tenga un target claro.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import React from "react";
import { ExternalLink, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { Link } from "@/lib/navigation";
import { protocol, rootDomain } from "@/lib/utils";

import {
  DeleteSiteDialog,
  type DeleteSiteDialogTexts,
} from "./DeleteSiteDialog";

export interface SiteCardTexts {
  campaignCount: (count: number) => string;
  manageCampaignsButton: string;
  deleteSiteAriaLabel: (subdomain: string) => string;
  openSiteAriaLabel: string;
  popoverTitle: string;
  popoverDescription: string;
}

export type { DeleteSiteDialogTexts };

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
 * @description Renderiza una tarjeta interactiva que muestra información sobre un
 *              sitio y proporciona acciones de gestión como navegar a las campañas,
 *              abrir el sitio en una nueva pestaña y eliminarlo.
 * @param {SiteCardProps} props - Las propiedades para configurar la tarjeta.
 * @returns {React.ReactElement}
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
    <Card className="flex flex-col justify-between h-full transition-all hover:border-primary/50 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{site.subdomain}</CardTitle>
            <CardDescription>
              {texts.campaignCount(site.campaign_count)}
            </CardDescription>
          </div>
          <div className="text-4xl">{site.icon}</div>
        </div>
      </CardHeader>
      <CardFooter className="justify-between">
        <Button variant="outline" asChild>
          <Link
            href={{
              pathname: "/dashboard/sites/[siteId]/campaigns",
              params: { siteId: site.id },
            }}
          >
            {texts.manageCampaignsButton}
          </Link>
        </Button>
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label="Ver previsualización"
              >
                <Info className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-4">
                <h4 className="font-semibold">{texts.popoverTitle}</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  {texts.popoverDescription}
                </p>
              </div>
            </PopoverContent>
          </Popover>

          <Button asChild variant="ghost" size="icon" className="h-9 w-9">
            <a
              href={`${protocol}://${site.subdomain}.${rootDomain}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={texts.openSiteAriaLabel}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <DeleteSiteDialog
            site={{ id: site.id, subdomain: site.subdomain }}
            onDelete={onDelete}
            isPending={isPending && deletingSiteId === site.id}
            texts={deleteDialogTexts}
          />
        </div>
      </CardFooter>
    </Card>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Navegación en la Tarjeta Completa**: ((Vigente)) Para hacer toda la tarjeta navegable, se podría envolver la `Card` en un `<Link>` y agregar `onClick={(e) => e.stopPropagation()}` a todos los botones internos para prevenir que el evento de clic se propague al `Link` padre.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Dependencia Final**: ((Implementada)) La reconstrucción de este aparato resuelve la última dependencia para `SitesGrid`, completando todo el flujo de UI de la página de sitios.
 * 2. **Corrección de Accesibilidad Crítica**: ((Implementada)) Se ha reestructurado el componente para eliminar los controles interactivos anidados, resolviendo la violación de `nested-interactive`. La interacción del popover ahora está en su propio botón dedicado.
 *
 * =====================================================================
 */
// src/components/sites/SiteCard.tsx
