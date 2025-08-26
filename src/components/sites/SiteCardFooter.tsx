// src/components/sites/SiteCardFooter.tsx
/**
 * @file SiteCardFooter.tsx
 * @description Componente de presentación soberano que consume sus propias
 *              traducciones para renderizar el pie de página de una tarjeta de sitio.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { ExternalLink, ShieldAlert, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardFooter as CardFooterPrimitive } from "@/components/ui/card";
import { ConfirmationDialogContent } from "@/components/ui/ConfirmationDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { Link } from "@/lib/navigation";
import { protocol, rootDomain } from "@/lib/utils";
import { clientLogger } from "@/lib/logging";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const { tSitesPage, tDialogs } = useDashboardTranslations();

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
          aria-label={tSitesPage("card.openSiteAriaLabel")}
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
              aria-label={tSitesPage("card.deleteSiteAriaLabel", {
                subdomain: site.subdomain,
              })}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <ConfirmationDialogContent
            icon={ShieldAlert}
            title={tSitesPage("deleteDialog.title")}
            description={tSitesPage.rich("deleteDialog.description", {
              subdomain: site.subdomain,
              strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
            })}
            confirmButtonText={tSitesPage("deleteDialog.confirmButton")}
            cancelButtonText={tDialogs("generic_cancelButton")}
            onConfirm={onDelete}
            onClose={() => setIsDeleteDialogOpen(false)}
            isPending={isPending && deletingSiteId === site.id}
            hiddenInputs={{ siteId: site.id }}
            confirmationText={site.subdomain || ""}
            confirmationLabel={tSitesPage.rich(
              "deleteDialog.confirmation_label",
              {
                subdomain: site.subdomain,
                strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
              }
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
 * 1. ((Implementada)) **Soberanía de i18n:** El componente ahora consume `useDashboardTranslations` internamente, eliminando las props `texts` y `deleteDialogTexts`. Esta es una corrección arquitectónica clave en la cadena de refactorización.
 * 2. ((Implementada)) **Full Observabilidad:** Se ha añadido `clientLogger.trace` para registrar su renderizado, mejorando la visibilidad del ciclo de vida de la UI.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Abstracción del Diálogo:** El componente `ConfirmationDialogContent` es muy reutilizable. Su lógica de activación (el `Dialog` y `DialogTrigger`) podría abstraerse a un hook `useConfirmationDialog` para un código aún más limpio y declarativo. Esto permitiría un código como: `const { DialogTrigger, DialogContent } = useConfirmationDialog({ onConfirm: handleDelete, ... })`.
 * 2. ((Vigente)) **Popover de Acciones:** Para escalar y añadir más acciones (ej. "Ajustes del Sitio", "Transferir Propiedad") sin saturar la UI, los botones de acción (`ExternalLink`, `Trash2`) podrían ser consolidados dentro de un `DropdownMenu` activado por un único botón de "tres puntos".
 *
 * =====================================================================
 */
// src/components/sites/SiteCardFooter.tsx
