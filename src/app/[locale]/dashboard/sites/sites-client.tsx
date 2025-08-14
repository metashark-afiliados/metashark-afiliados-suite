/**
 * @file src/app/[locale]/dashboard/sites/sites-client.tsx
 * @description Orquestador de UI puro para la página "Mis Sitios". Ha sido
 *              nivelado a un estándar de élite para construir y pasar
 *              explícitamente los objetos de props de texto (`texts`) a sus
 *              componentes hijos, resolviendo un `TypeError` crítico en runtime.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { PaginationControls } from "@/components/shared/pagination-controls";
import { SitesGrid } from "@/components/sites/SitesGrid";
import { SitesHeader } from "@/components/sites/SitesHeader";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { useSitesPage } from "@/lib/hooks/use-sites-page";

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
  const t = useTranslations("SitesPage");
  const tDialogs = useTranslations("Dialogs");

  const {
    sites,
    activeWorkspaceId,
    isPending,
    mutatingId,
    handleSearch,
    handleCreate,
    handleDelete,
    isCreateDialogOpen,
    setCreateDialogOpen,
  } = useSitesPage({ initialSites });

  if (!activeWorkspaceId) {
    return null;
  }

  // --- INICIO DE CORRECCIÓN CRÍTICA ---
  // Construcción de los objetos de props de texto, alineados con el schema.
  const texts = {
    header: {
      title: t("header.title"),
      description: t("header.description"),
      searchPlaceholder: t("header.searchPlaceholder"),
      clearSearchAria: t("header.clearSearchAria"),
      createSiteButton: t("header.createSiteButton"),
      createDialogTitle: t("header.createDialogTitle"),
    },
    form: {
      nameLabel: t("form.nameLabel"),
      namePlaceholder: t("form.namePlaceholder"),
      subdomainLabel: t("form.subdomainLabel"),
      subdomainInUseError: t("form.subdomainInUseError"),
      descriptionLabel: t("form.descriptionLabel"),
      descriptionPlaceholder: t("form.descriptionPlaceholder"),
      creatingButton: t("form.creatingButton"),
      createButton: t("form.createButton"),
    },
    grid: {
      emptyStateTitle: t("grid.emptyStateTitle"),
      emptyStateDescription: t("grid.emptyStateDescription"),
    },
    card: {
      campaignCount: (count: number) => t("card.campaignCount", { count }),
      manageCampaignsButton: t("card.manageCampaignsButton"),
      deleteSiteAriaLabel: (subdomain: string) =>
        t("card.deleteSiteAriaLabel", { subdomain }),
      openSiteAriaLabel: t("card.openSiteAriaLabel"),
      popoverTitle: t("card.popoverTitle"),
      popoverDescription: t("card.popoverDescription"),
    },
    deleteDialog: {
      title: t("deleteDialog.title"),
      description: (subdomain: string) =>
        t.rich("deleteDialog.description", {
          subdomain,
          strong: (chunks) => <strong>{chunks}</strong>,
        }),
      confirmButton: t("deleteDialog.confirmButton"),
      cancelButton: tDialogs("generic_cancelButton"),
    },
    pagination: {
      previousPageLabel: t("pagination.previous"),
      nextPageLabel: t("pagination.next"),
      pageLabelTemplate: t("pagination.page"),
    },
  };
  // --- FIN DE CORRECCIÓN CRÍTICA ---

  return (
    <div className="space-y-6 relative">
      <SitesHeader
        texts={texts.header}
        formTexts={texts.form}
        isCreateDialogOpen={isCreateDialogOpen}
        setCreateDialogOpen={setCreateDialogOpen}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        workspaceId={activeWorkspaceId}
        onCreate={handleCreate}
        isPending={isPending}
      />
      <SitesGrid
        sites={sites}
        onDelete={handleDelete}
        isPending={isPending}
        deletingSiteId={mutatingId}
        texts={texts.grid}
        cardTexts={texts.card}
        deleteDialogTexts={texts.deleteDialog}
      />
      <PaginationControls
        page={page}
        totalCount={totalCount}
        limit={limit}
        basePath="/dashboard/sites"
        searchQuery={searchQuery}
        texts={texts.pagination}
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
 * 1. **Resolución de Error de Runtime Crítico**: ((Implementada)) El componente ahora construye y pasa los objetos de `texts` a sus hijos, resolviendo el `TypeError` que rompía la página.
 * 2. **Alineación Arquitectónica**: ((Implementada)) Se ha restaurado la comunicación correcta entre el orquestador de cliente y los componentes de presentación.
 *
 * @subsection Melhorias Futuras
 * 1. **Memoización de `texts`**: ((Vigente)) El objeto `texts` se reconstruye en cada render. Para una optimización de élite, podría ser memoizado con `useMemo`.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/sites-client.tsx
