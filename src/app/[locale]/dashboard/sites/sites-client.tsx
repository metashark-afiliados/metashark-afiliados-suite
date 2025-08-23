// src/app/[locale]/dashboard/sites/sites-client.tsx
/**
 * @file sites-client.tsx
 * @description Orquestador de UI de élite. Ha sido refactorizado para utilizar
 *              `React.useMemo`, optimizando el rendimiento al prevenir la
 *              re-creación innecesaria de los objetos de `texts` en cada render.
 * @author Raz Podestá
 * @version 5.1.0
 */
"use client";

import { PlusCircle } from "lucide-react";
import React from "react";

import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { CreateSiteForm } from "@/components/sites/CreateSiteForm";
import { SitesGrid } from "@/components/sites/SitesGrid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchInput } from "@/components/ui/SearchInput";
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

  // --- INICIO DE OPTIMIZACIÓN DE RENDIMIENTO CON useMemo ---
  const breadcrumbs = React.useMemo(
    () => [
      { label: t("breadcrumbs.dashboard"), href: "/dashboard" },
      { label: t("breadcrumbs.sites") },
    ],
    [t]
  );

  const primaryAction = React.useMemo(
    () => (
      <Button onClick={openCreateDialog}>
        <PlusCircle className="mr-2 h-4 w-4" />
        {t("header.createSiteButton")}
      </Button>
    ),
    [openCreateDialog, t]
  );

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
  // --- FIN DE OPTIMIZACIÓN DE RENDIMIENTO CON useMemo ---

  if (!activeWorkspaceId) {
    return null;
  }

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
 * 1. **Optimización de Renderizado (Memoización)**: ((Implementada)) Todos los objetos de props de texto (`formTexts`, `gridTexts`, etc.) y el `primaryAction` (que es JSX) ahora están envueltos en `React.useMemo`. Esto garantiza que estos objetos no se re-creen en cada renderizado a menos que sus dependencias (`t`, `openCreateDialog`) cambien, previniendo re-renderizados innecesarios en los componentes hijos puros.
 *
 * @subsection Melhorias Futuras
 * 1. **Paginación del Lado del Cliente**: ((Vigente)) Para mejorar la experiencia de usuario y reducir las llamadas al servidor, se podría implementar una estrategia de "cargar más" o paginación del lado del cliente utilizando el hook `useOptimisticResourceManagement` si el número total de sitios es manejable.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/sites-client.tsx
