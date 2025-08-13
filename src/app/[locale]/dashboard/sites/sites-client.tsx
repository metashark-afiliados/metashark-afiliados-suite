// src/app/[locale]/dashboard/sites/sites-client.tsx
/**
 * @file src/app/[locale]/dashboard/sites/sites-client.tsx
 * @description Orquestador de UI puro para la página "Mis Sitios". Este componente
 *              de cliente consume el hook soberano `useSitesPage` para obtener toda
 *              su lógica y estado. Su única responsabilidad es ensamblar los
 *              componentes de presentación atómicos y proveerles los datos y
 *              callbacks necesarios, junto con los textos internacionalizados.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { PaginationControls } from "@/components/shared/pagination-controls";
import { SitesGrid } from "@/components/sites/SitesGrid";
import { SitesHeader } from "@/components/sites/SitesHeader";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { useSitesPage } from "@/lib/hooks/useSitesPage";

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
 * @description Orquesta la UI para la página "Mis Sitios".
 * @param {SitesClientProps} props - Propiedades iniciales del servidor.
 * @returns {React.ReactElement | null} El componente cliente renderizado.
 */
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
    // Este caso no debería ocurrir si el layout funciona correctamente,
    // pero es una guarda de seguridad.
    return null;
  }

  const texts = {
    header: {
      title: t("header_title"),
      description: t("header_description"),
      searchPlaceholder: t("search_placeholder"),
      clearSearchAria: t("clear_search_aria"),
      createSiteButton: t("createSite_button"),
      createDialogTitle: t("createSiteDialog_title"),
    },
    form: {
      nameLabel: t("form_name_label"),
      namePlaceholder: t("form_name_placeholder"),
      subdomainLabel: t("form_subdomain_label"),
      subdomainInUseError: t("subdomain_in_use_error"),
      descriptionLabel: t("form_description_label"),
      descriptionPlaceholder: t("form_description_placeholder"),
      creatingButton: t("form_creating_button"),
      createButton: t("form_create_button"),
    },
    grid: {
      emptyStateTitle: t("emptyState_title"),
      emptyStateDescription: t("emptyState_description"),
    },
    card: {
      campaignCount: (count: number) => t("campaignCount", { count }),
      manageCampaignsButton: t("manageCampaigns_button"),
      deleteSiteAriaLabel: (subdomain: string) =>
        t("delete_site_aria_label", { subdomain }),
      openSiteAriaLabel: t("open_site_aria_label"),
      popoverTitle: t("popover_title"),
      popoverDescription: t("popover_description"),
    },
    deleteDialog: {
      title: t("deleteDialog_title"),
      description: (subdomain: string) =>
        t.rich("deleteDialog_description", {
          subdomain,
          strong: (chunks) => <strong>{chunks}</strong>,
        }),
      confirmButton: t("deleteDialog_confirmButton"),
      cancelButton: tDialogs("generic_cancelButton"),
    },
    pagination: {
      previousPageLabel: t("pagination.previous"),
      nextPageLabel: t("pagination.next"),
      pageLabelTemplate: t("pagination.page"),
    },
  };

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
 * @subsection Melhorias Futuras
 * 1. **Memoización de `texts`**: ((Vigente)) El objeto `texts` se reconstruye en cada render. Para una optimización de élite, podría ser memoizado con `useMemo`, con `t` y `tDialogs` como dependencias.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura Soberana**: ((Implementada)) Este componente es un ejemplo canónico de la arquitectura de UI del proyecto: un orquestador puro que consume un hook soberano y compone piezas de UI atómicas.
 * 2. **Full Internacionalización**: ((Implementada)) El componente actúa como la capa que obtiene todas las traducciones necesarias y las inyecta en los componentes de presentación puros.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/sites-client.tsx
