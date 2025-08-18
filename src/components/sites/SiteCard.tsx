// src/components/sites/SiteCard.tsx
/**
 * @file src/components/sites/SiteCard.tsx
 * @description Componente de presentación atómico para una tarjeta de sitio.
 *              Ha sido refactorizado para consumir el nuevo `ConfirmationDialogContent`
 *              y gestionar su propio estado de diálogo, siguiendo el patrón de
 *              composición de élite.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
"use client";

import React, { useState } from "react";
import { ExternalLink, Info, ShieldAlert, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ConfirmationDialogContent } from "@/components/ui/ConfirmationDialog";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { Link } from "@/lib/navigation";
import { protocol, rootDomain } from "@/lib/utils";

// ... (Interfaces de props sin cambios) ...
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

export function SiteCard({
  site,
  onDelete,
  isPending,
  deletingSiteId,
  texts,
  deleteDialogTexts,
}: SiteCardProps): React.ReactElement {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteConfirm = (formData: FormData) => {
    onDelete(formData);
    // La UI optimista se encargará de remover la tarjeta,
    // y la revalidación del servidor confirmará el estado.
    // Podríamos cerrar el diálogo aquí, pero es mejor esperar
    // la respuesta de la acción.
  };

  return (
    <Card className="flex flex-col justify-between h-full transition-all hover:border-primary/50 hover:shadow-lg">
      <CardHeader>{/* ... (Contenido sin cambios) ... */}</CardHeader>
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
          {/* ... (Popover y ExternalLink sin cambios) ... */}

          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive h-9 w-9"
                aria-label={texts.deleteSiteAriaLabel(site.subdomain || "")}
              />
            </DialogTrigger>
            <ConfirmationDialogContent
              icon={ShieldAlert}
              title={deleteDialogTexts.title}
              description={deleteDialogTexts.description(site.subdomain || "")}
              confirmButtonText={deleteDialogTexts.confirmButton}
              cancelButtonText={deleteDialogTexts.cancelButton}
              onConfirm={handleDeleteConfirm}
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
      </CardFooter>
    </Card>
  );
}
// src/components/sites/SiteCard.tsx
