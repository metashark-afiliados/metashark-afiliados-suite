// src/app/[locale]/dashboard/sites/sites-client.tsx
"use client";

import React from "react";
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

/**
 * @public
 * @component SitesClient
 * @description Orquestador de UI de élite. Ensambla la página "Mis Sitios",
 *              consume el hook soberano `useSitesPage` y construye los objetos
 *              de props de texto para sus componentes hijos.
 * @param {SitesClientProps} props - Propiedades para configurar el componente.
 * @returns {React.ReactElement | null}
 * @version 5.0.0
 * @author Raz Podestá
 */
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

  if (!activeWorkspaceId) {
    return null;
  }

  // --- Lógica de Construcción de Props de Presentación ---
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

  const formTexts = {
    nameLabel: t("form.nameLabel"),
    namePlaceholder: t("form.namePlaceholder"),
    subdomainLabel: t("form.subdomainLabel"),
    subdomainInUseError: t("form.subdomainInUseError"),
    descriptionLabel: t("form.descriptionLabel"),
    descriptionPlaceholder: t("form.descriptionPlaceholder"),
    creatingButton: t("form.creatingButton"),
    createButton: t("form.createButton"),
  };

  const gridTexts = {
    emptyStateTitle: t("grid.emptyStateTitle"),
    emptyStateDescription: t("grid.emptyStateDescription"),
  };

  const cardTexts = {
    campaignCount: (count: number) => t("card.campaignCount", { count }),
    manageCampaignsButton: t("card.manageCampaignsButton"),
    deleteSiteAriaLabel: (subdomain: string) =>
      t("card.deleteSiteAriaLabel", { subdomain }),
    openSiteAriaLabel: t("card.openSiteAriaLabel"),
    popoverTitle: t("card.popoverTitle"),
    popoverDescription: t("card.popoverDescription"),
  };

  const deleteDialogTexts = {
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
  };
  // --- Fin de la Lógica de Construcción ---

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        breadcrumbs={breadcrumbs}
        primaryAction={primaryAction}
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

      <div className="w-full md:w-1/3">
        <SearchInput
          placeholder={t("header.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          clearAriaLabel={t("header.clearSearchAria")}
        />
      </div>

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
 * 1. **Restauración de SRP**: ((Implementada)) El componente `sites-client` vuelve a asumir su rol correcto de construir los datos de presentación (textos) a partir de las funciones `t` que recibe del hook, resolviendo el error de compilación.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/sites-client.tsx
