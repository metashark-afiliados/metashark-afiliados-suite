// src/components/sites/SiteCardHeader.tsx
/**
 * @file SiteCardHeader.tsx
 * @description Componente de presentación soberano. Ha sido refactorizado para
 *              alinearse con la arquitectura de datos atómica, consumiendo sus
 *              tipos desde la SSoT canónica y resolviendo el error de módulo TS2306.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { ExternalLink, ShieldAlert, Trash2 } from "lucide-react";

import { useDialogState } from "@/lib/hooks/ui/useDialogState";
import { useSitesPageTranslations } from "@/lib/hooks/i18n/useSitesPageTranslations";
// --- INICIO DE CORRECCIÓN DE MÓDULO (TS2306) ---
import { type SiteWithCampaignCount } from "@/lib/data/sites/types";
// --- FIN DE CORRECCIÓN DE MÓDULO (TS2306) ---
import { Link } from "@/lib/navigation";
import { protocol, rootDomain } from "@/lib/utils";
import { clientLogger } from "@/lib/logging";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CardHeader as CardHeaderPrimitive,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmationDialogContent } from "@/components/ui/ConfirmationDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export interface SiteCardHeaderProps {
  site: SiteWithCampaignCount;
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  deletingSiteId: string | null;
}

export function SiteCardHeader({
  site,
  onDelete,
  isPending,
  deletingSiteId,
}: SiteCardHeaderProps): React.ReactElement {
  clientLogger.trace(`[SiteCardHeader] Renderizando para sitio: ${site.id}`);
  const { tSitesPage, tDialogs } = useSitesPageTranslations();
  const {
    isOpen: isDeleteDialogOpen,
    open: openDeleteDialog,
    setIsOpen: setIsDeleteDialogOpen,
  } = useDialogState();

  const siteUrl = `${protocol}://${site.subdomain}.${rootDomain}`;

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
          <CardTitle className="group-hover:underline">{site.name}</CardTitle>
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
              onClick={(e) => {
                e.stopPropagation();
                openDeleteDialog();
              }}
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
    </CardHeaderPrimitive>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Módulo (TS2306)**: ((Implementada)) Se ha corregido la ruta de importación para que apunte a la SSoT de tipos `.../sites/types.ts`, resolviendo el error de compilación.
 *
 * @subsection Melhorias Futuras
 * 1. **Edición en Línea del Nombre**: ((Vigente)) El `CardTitle` es un candidato ideal para ser reemplazado por un componente `EditableText`.
 *
 * =====================================================================
 */
// src/components/sites/SiteCardHeader.tsx
