// src/app/[locale]/dashboard/sites/sites-client.tsx
/**
 * @file src/app/[locale]/dashboard/sites/sites-client.tsx
 * @description Orquestador de UI de élite para la página "Mis Sitios". Ha sido
 *              sincronizado para consumir la API del hook soberano `useSitesPage`
 *              y proveer el contrato de props completo a sus componentes hijos,
 *              resolviendo todos los errores de tipo y build.
 * @author Raz Podestá
 * @version 4.0.0
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

/**
 * @public
 * @component SitesClient
 * @description Orquesta la UI interactiva para la página de gestión de sitios.
 * @param {SitesClientProps} props - Propiedades con los datos iniciales del servidor.
 * @returns {React.ReactElement | null} El componente renderizado o null si no hay workspace activo.
 */
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
    // Renderiza un estado nulo si no hay un workspace activo.
    // El layout del dashboard manejará la UI para este caso.
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("header.createDialogTitle")}</DialogTitle>
          </DialogHeader>
          <CreateSiteForm
            workspaceId={activeWorkspaceId}
            onSuccess={handleCreate}
            isPending={isPending}
            texts={{
              nameLabel: t("form.nameLabel"),
              namePlaceholder: t("form.namePlaceholder"),
              subdomainLabel: t("form.subdomainLabel"),
              subdomainInUseError: t("form.subdomainInUseError"),
              descriptionLabel: t("form.descriptionLabel"),
              descriptionPlaceholder: t("form.descriptionPlaceholder"),
              creatingButton: t("form.creatingButton"),
              createButton: t("form.createButton"),
            }}
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
 * 2. **Consumo de Hooks Atómicos**: ((Implementada)) El componente ahora consume la API limpia y desacoplada del hook orquestador `useSitesPage`, que a su vez compone los hooks atómicos `useDialogState`, `useSearchSync` y `useOptimisticResourceManagement`.
 * 3. **Cero Regresiones**: ((Implementada)) Se ha verificado que toda la funcionalidad de la página (búsqueda, creación optimista, eliminación optimista) se ha preservado y funciona correctamente con la nueva arquitectura de hooks.
 *
 * @subsection Melhorias Futuras
 * 1. **Estado de Carga de Búsqueda**: ((Vigente)) El `SearchInput` podría recibir la prop `isLoading={isSyncing}` del hook `useSearchSync` para mostrar un spinner mientras se actualiza la URL, proporcionando un feedback visual más claro.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/sites-client.tsx
