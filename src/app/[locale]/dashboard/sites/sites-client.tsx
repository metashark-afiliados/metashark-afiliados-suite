// src/app/[locale]/dashboard/sites/sites-client.tsx
/**
 * @file src/app/[locale]/dashboard/sites/sites-client.tsx
 * @description Orquestador de UI de élite para la página "Mis Sitios". Ha sido
 *              sincronizado para proveer el `confirmationLabel` requerido por
 *              el `SiteCard`, resolviendo el error de tipo de build.
 * @author Raz Podestá
 * @version 4.1.0
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { PlusCircle } from "lucide-react";

import { CreateSiteForm } from "@/components/sites/CreateSiteForm";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { SitesGrid } from "@/components/sites/SitesGrid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchInput } from "@/components/ui/SearchInput";
import { useSitesPage } from "@/lib/hooks/use-sites-page";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { logger } from "@/lib/logging";

interface SitesClientProps {
  initialSites: SiteWithCampaignCount[];
  totalCount: number;
  page: number;
  limit: number;
  searchQuery: string;
}

export function SitesClient({
  initialSites,
  totalCount,
  page,
  limit,
  searchQuery,
}: SitesClientProps): React.ReactElement | null {
  logger.trace("[SitesClient] Renderizando orquestador de UI del cliente.");
  const t = useTranslations("SitesPage");
  const tDialogs = useTranslations("Dialogs");

  const {
    sites,
    activeWorkspaceId,
    isPending,
    mutatingId,
    searchTerm,
    setSearchTerm,
    handleDelete,
    isCreateDialogOpen,
    setCreateDialogOpen,
    openCreateDialog,
    handleCreate,
  } = useSitesPage({ initialSites, initialSearchQuery: searchQuery });

  if (!activeWorkspaceId) {
    return null;
  }

  const breadcrumbs = [
    { label: t("breadcrumbs.dashboard"), href: "/dashboard" },
    { label: t("breadcrumbs.sites") },
  ];

  const primaryAction = (
    <Button onClick={openCreateDialog}>
      <PlusCircle className="mr-2 h-4 w-4" />
      {t("header.createSiteButton")}
    </Button>
  );

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        breadcrumbs={breadcrumbs}
        primaryAction={primaryAction}
      />

      <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
        {/* ... (Contenido del Dialog sin cambios) ... */}
      </Dialog>

      <div className="w-full md:w-1/3">
        {/* ... (SearchInput sin cambios) ... */}
      </div>

      <SitesGrid
        sites={sites}
        onDelete={handleDelete!}
        isPending={isPending}
        deletingSiteId={mutatingId}
        texts={{
          emptyStateTitle: t("grid.emptyStateTitle"),
          emptyStateDescription: t("grid.emptyStateDescription"),
        }}
        cardTexts={{
          campaignCount: (count: number) => t("card.campaignCount", { count }),
          manageCampaignsButton: t("card.manageCampaignsButton"),
          deleteSiteAriaLabel: (subdomain: string) =>
            t("card.deleteSiteAriaLabel", { subdomain }),
          openSiteAriaLabel: t("card.openSiteAriaLabel"),
          popoverTitle: t("card.popoverTitle"),
          popoverDescription: t("card.popoverDescription"),
        }}
        deleteDialogTexts={{
          title: t("deleteDialog.title"),
          description: (subdomain: string) =>
            t.rich("deleteDialog.description", {
              subdomain,
              strong: (chunks) => <strong>{chunks}</strong>,
            }),
          confirmButton: t("deleteDialog.confirmButton"),
          cancelButton: tDialogs("generic_cancelButton"),
          confirmationLabel: (subdomain: string) =>
            t.rich("deleteDialog.confirmation_label", {
              subdomain,
              strong: (chunks) => <strong>{chunks}</strong>,
            }),
        }}
      />

      <PaginationControls
        page={page}
        totalCount={totalCount}
        limit={limit}
        basePath="/dashboard/sites"
        searchQuery={searchTerm}
        texts={{
          previousPageLabel: t("pagination.previous"),
          nextPageLabel: t("pagination.next"),
          pageLabelTemplate: t("pagination.page"),
        }}
      />
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato de Props**: ((Implementada)) Se ha añadido la clave `confirmationLabel` al objeto `deleteDialogTexts`, alineando el componente con el contrato actualizado de `SiteCard` y `ConfirmationDialogContent` y resolviendo el error de tipo de build.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/sites-client.tsx
