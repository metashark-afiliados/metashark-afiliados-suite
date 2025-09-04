// src/app/[locale]/dashboard/sites/sites-client.tsx
/**
 * @file sites-client.tsx
 * @description Orquestador de UI de élite. Ha sido refactorizado para obtener
 *              los textos de paginación y propagarlos a sus componentes hijos,
 *              resolviendo la cadena de errores de tipo TS2741.
 * @author Raz Podestá - MetaShark Tech
 * @version 20.0.0
 * @date 2025-08-31
 */
"use client";

import { AlertTriangle } from "lucide-react";
import React from "react";

import { ErrorStateCard } from "@/components/shared/error-state-card";
import { PaginatedResourceView } from "@/components/shared/PaginatedResourceView";
import { type PaginationTexts } from "@/components/shared/pagination-controls";
import { CreateSiteForm } from "@/components/sites/CreateSiteForm";
import { SitesGrid } from "@/components/sites/SitesGrid";
import { SitesHeader } from "@/components/sites/SitesHeader";
import { SitesTable } from "@/components/sites/SitesTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { useSitesPageTranslations } from "@/lib/hooks/i18n/useSitesPageTranslations";
import { useSitesPage } from "@/lib/hooks/useSitesPage";
import { clientLogger } from "@/lib/logger";

interface SitesClientProps {
  initialSites: SiteWithCampaignCount[];
  totalCount: number;
  page: number;
  limit: number;
  initialSearchQuery: string;
  initialStatusFilter: "all" | "draft" | "published" | "archived";
  initialSortOption: "created_at_desc" | "name_asc" | "name_desc";
}

export function SitesClient(props: SitesClientProps): React.ReactElement {
  clientLogger.trace(
    "[SitesClient] Renderizando orquestador de UI refactorizado."
  );

  const { tSitesPage, tErrors } = useSitesPageTranslations();

  const {
    sites,
    activeWorkspaceId,
    isPending,
    mutatingId,
    handleDelete,
    isCreateDialogOpen,
    openCreateDialog,
    setCreateDialogOpen,
    handleCreate,
    handleUpdateSiteName,
    ...headerProps
  } = useSitesPage(props);

  if (!activeWorkspaceId) {
    return (
      <ErrorStateCard
        icon={AlertTriangle}
        title={tErrors("generic.error_unauthenticated")}
        description={tErrors("generic.error_no_active_workspace")}
      />
    );
  }

  // --- INICIO DE REFACTORIZACIÓN (CONSTRUCCIÓN Y PROPAGACIÓN DE PROPS I18N) ---
  const paginationTexts: PaginationTexts = {
    previous: tSitesPage("pagination.previous"),
    next: tSitesPage("pagination.next"),
    page: tSitesPage("pagination.page"),
  };
  // --- FIN DE REFACTORIZACIÓN ---

  return (
    <div className="flex flex-col gap-6">
      <SitesHeader onCreateSiteClick={openCreateDialog} {...headerProps} />

      <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tSitesPage("header.createDialogTitle")}</DialogTitle>
          </DialogHeader>
          <CreateSiteForm
            workspaceId={activeWorkspaceId}
            onSuccess={handleCreate}
            isPending={
              isPending && (mutatingId?.startsWith("optimistic-") ?? false)
            }
          />
        </DialogContent>
      </Dialog>

      <PaginatedResourceView
        viewKey={headerProps.viewMode}
        items={sites}
        emptyStateText={tSitesPage("grid.emptyStateTitle")}
        page={props.page}
        totalCount={props.totalCount}
        limit={props.limit}
        basePath="/dashboard/sites"
        searchQuery={headerProps.searchQuery}
        paginationTexts={paginationTexts} // <-- PROP INYECTADA
        renderView={(currentItems) =>
          headerProps.viewMode === "grid" ? (
            <SitesGrid
              sites={currentItems}
              onDelete={handleDelete!}
              isPending={isPending}
              deletingSiteId={mutatingId}
              handleUpdateSiteName={handleUpdateSiteName}
              isUpdatingName={
                isPending && !mutatingId?.startsWith("optimistic-")
              }
              updatingSiteNameId={mutatingId}
            />
          ) : (
            <SitesTable
              sites={currentItems}
              onDelete={handleDelete!}
              isPending={isPending}
              deletingSiteId={mutatingId}
              handleUpdateSiteName={handleUpdateSiteName}
              isUpdatingName={
                isPending && !mutatingId?.startsWith("optimistic-")
              }
              updatingSiteNameId={mutatingId}
              page={props.page}
              totalCount={props.totalCount}
              limit={props.limit}
              basePath="/dashboard/sites"
              searchQuery={headerProps.searchQuery}
              paginationTexts={paginationTexts} // <-- PROP INYECTADA
            />
          )
        }
      />
    </div>
  );
}
// src/app/[locale]/dashboard/sites/sites-client.tsx
