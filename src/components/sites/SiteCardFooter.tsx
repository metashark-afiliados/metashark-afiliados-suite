// src/components/sites/SiteCardFooter.tsx
import React from "react";
import { ExternalLink, ShieldAlert, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardFooter as CardFooterPrimitive } from "@/components/ui/card";
import { ConfirmationDialogContent } from "@/components/ui/ConfirmationDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { Link } from "@/lib/navigation";
import { protocol, rootDomain } from "@/lib/utils";
import { type DeleteSiteDialogTexts, type SiteCardTexts } from "./SiteCard";

export interface SiteCardFooterProps {
  site: SiteWithCampaignCount;
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  deletingSiteId: string | null;
  texts: SiteCardTexts;
  deleteDialogTexts: DeleteSiteDialogTexts;
}

/**
 * @public
 * @component SiteCardFooter
 * @description Componente de presentación puro que renderiza el pie de página de
 *              una tarjeta de sitio, encapsulando los botones de acción y el
 *              diálogo de confirmación de eliminación.
 * @param {SiteCardFooterProps} props - Propiedades para configurar el pie de página.
 * @returns {React.ReactElement}
 * @version 1.0.0
 * @author Raz Podestá
 */
export function SiteCardFooter({
  site,
  onDelete,
  isPending,
  deletingSiteId,
  texts,
  deleteDialogTexts,
}: SiteCardFooterProps): React.ReactElement {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  return (
    <CardFooterPrimitive className="justify-between">
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
        <a
          href={`${protocol}://${site.subdomain}.${rootDomain}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={texts.openSiteAriaLabel}
        >
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive h-9 w-9"
              aria-label={texts.deleteSiteAriaLabel(site.subdomain || "")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <ConfirmationDialogContent
            icon={ShieldAlert}
            title={deleteDialogTexts.title}
            description={deleteDialogTexts.description(site.subdomain || "")}
            confirmButtonText={deleteDialogTexts.confirmButton}
            cancelButtonText={deleteDialogTexts.cancelButton}
            onConfirm={onDelete}
            onClose={() => setIsDeleteDialogOpen(false)}
            isPending={isPending && deletingSiteId === site.id}
            hiddenInputs={{ siteId: site.id }}
            confirmationText={site.subdomain || ""}
            confirmationLabel={deleteDialogTexts.confirmationLabel(
              site.subdomain || ""
            )}
          />
        </Dialog>
      </div>
    </CardFooterPrimitive>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Encapsulamiento Lógico**: ((Implementada)) Este componente ahora gestiona su propio estado de diálogo, desacoplando completamente al orquestador.
 *
 * =====================================================================
 */
