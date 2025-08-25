// src/app/[locale]/dashboard/sites/sites-client.tsx
/**
 * @file sites-client.tsx
 * @description Orquestador de UI de élite para la página "Mis Sitios". Sincronizado
 *              para cumplir con el contrato de props completo de `SitesHeader`,
 *              resolviendo el error de tipo TS2741.
 * @author Raz Podestá
 * @version 7.1.0
 */
"use client";

import React from "react";

import { PaginationControls } from "@/components/shared/pagination-controls";
import { CreateSiteForm } from "@/components/sites/CreateSiteForm";
import { SitesGrid } from "@/components/sites/SitesGrid";
import { SitesHeader } from "@/components/sites/SitesHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { useSitesPage } from "@/lib/hooks/use-sites-page";
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
    t,
    tDialogs,
  } = useSitesPage({ initialSites, initialSearchQuery: searchQuery });

  const formTexts = React.useMemo(
    () => ({
      nameLabel: t("form.nameLabel"),
      namePlaceholder: t("form.namePlaceholder"),
      subdomainLabel: t("form.subdomainLabel"),
      subdomainInUseError: t("form.subdomainInUseError"),
      descriptionLabel: t("form.descriptionLabel"),
      descriptionPlaceholder: t("form.descriptionPlaceholder"),
      creatingButton: t("form.creatingButton"),
      createButton: t("form.createButton"),
    }),
    [t]
  );

  const gridTexts = React.useMemo(
    () => ({
      emptyStateTitle: t("grid.emptyStateTitle"),
      emptyStateDescription: t("grid.emptyStateDescription"),
    }),
    [t]
  );

  const cardTexts = React.useMemo(
    () => ({
      campaignCount: (count: number) => t("card.campaignCount", { count }),
      manageCampaignsButton: t("card.manageCampaignsButton"),
      deleteSiteAriaLabel: (subdomain: string) =>
        t("card.deleteSiteAriaLabel", { subdomain }),
      openSiteAriaLabel: t("card.openSiteAriaLabel"),
      popoverTitle: t("card.popoverTitle"),
      popoverDescription: t("card.popoverDescription"),
    }),
    [t]
  );

  const deleteDialogTexts = React.useMemo(
    () => ({
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
    }),
    [t, tDialogs]
  );

  if (!activeWorkspaceId) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <SitesHeader
        texts={{
          title: t("header.title"),
          description: t("header.description"),
          searchPlaceholder: t("header.searchPlaceholder"),
          clearSearchAria: t("header.clearSearchAria"),
          createSiteButton: t("header.createSiteButton"),
          // --- INICIO DE CORRECCIÓN ---
          createDialogTitle: t("header.createDialogTitle"),
          // --- FIN DE CORRECCIÓN ---
        }}
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateSiteClick={openCreateDialog}
      />

      <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("header.createDialogTitle")}</DialogTitle>
          </DialogHeader>
          <CreateSiteForm
            workspaceId={activeWorkspaceId}
            onSuccess={handleCreate}
            isPending={
              isPending && (mutatingId?.startsWith("optimistic-") ?? false)
            }
            texts={formTexts}
          />
        </DialogContent>
      </Dialog>

      <SitesGrid
        sites={sites}
        onDelete={handleDelete!}
        isPending={isPending}
        deletingSiteId={mutatingId}
        texts={gridTexts}
        cardTexts={cardTexts}
        deleteDialogTexts={deleteDialogTexts}
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
 * 1. **Resolución de Error de Tipo (TS2741)**: ((Implementada)) Se ha añadido la propiedad `createDialogTitle` al objeto `texts`, cumpliendo con el contrato de `SitesHeaderProps` y resolviendo el error de compilación.
 *
 * @subsection Melhorias Futuras
 * 1. **Vista de Lista vs. Cuadrícula**: ((Vigente)) Añadir un `ViewSwitcher` en `SitesHeader` para alternar entre `SitesGrid` y `SitesTable`.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/sites-client.tsx
