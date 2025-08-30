// src/app/[locale]/dashboard/sites/sites-client.tsx
/**
 * @file sites-client.tsx
 * @description Orquestador de UI de élite. Ha sido refactorizado holísticamente
 *              para consumir el nuevo aparato abstracto `PaginatedResourceView`,
 *              delegando toda la lógica de renderizado de vistas y paginación,
 *              y cumpliendo con el principio DRY al más alto nivel.
 * @author Raz Podestá - MetaShark Tech
 * @version 19.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

import { ErrorStateCard } from "@/components/shared/error-state-card";
import { PaginatedResourceView } from "@/components/shared/PaginatedResourceView";
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
import { clientLogger } from "@/lib/logging";

interface SitesClientProps {
  initialSites: SiteWithCampaignCount[];
  totalCount: number;
  page: number;
  limit: number;
  initialSearchQuery: string;
  initialStatusFilter: "all" | "draft" | "published" | "archived";
  initialSortOption: "created_at_desc" | "name_asc" | "name_desc";
}

/**
 * @public
 * @component SitesClient
 * @description Componente de presentación puro que ensambla la UI para la página "Mis Sitios".
 * @param {SitesClientProps} props - Propiedades iniciales pasadas desde el cargador del servidor.
 * @returns {React.ReactElement}
 */
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
            />
          )
        }
      />
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Contexto de Página (`SitesPageContext`)**: ((Vigente)) Para eliminar completamente el "prop drilling" hacia `SitesGrid` y `SitesTable`, este componente podría actuar como un proveedor de contexto, haciendo que el valor de retorno del hook `useSitesPage` esté disponible para todos sus componentes hijos sin necesidad de pasar props explícitamente.
 * 2. **Factoría de Items Optimistas Atómica**: ((Vigente)) La lógica para crear `optimisticItem` en el hook `useSitesPage` podría ser extraída a un helper `optimisticItemFactory.ts` para una máxima reutilización.
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/sites-client.tsx
