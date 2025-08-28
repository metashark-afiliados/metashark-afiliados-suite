// src/app/[locale]/dashboard/sites/sites-client.tsx
/**
 * @file sites-client.tsx
 * @description Orquestador de UI. Ha sido refactorizado a un estándar de élite
 *              para consumir el hook soberano `useSitesPage` simplificado,
 *              alineando la capa de presentación con la nueva arquitectura de
 *              hooks atómicos.
 * @author Raz Podestá - MetaShark Tech
 * @version 16.0.0
 * @date 2025-08-27
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
    "[SitesClient] Renderizando orquestador de UI puro y simplificado."
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
    ...headerProps // El resto de las props son para el encabezado
  } = useSitesPage(props);

  if (!activeWorkspaceId) {
    return (
      <ErrorStateCard
        icon={AlertTriangle}
        title={tErrors("error_unauthenticated")}
        description={tErrors("error_no_active_workspace")}
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
            />
          ) : (
            <SitesTable
              sites={currentItems}
              onDelete={handleDelete!}
              isPending={isPending}
              deletingSiteId={mutatingId}
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
 *
 * @subsection Melhorias Futuras
 * 1. **Contexto de Página (`SitesPageContext`)**: ((Vigente)) Para eliminar completamente el "prop drilling", el `SitesClient` podría actuar como un proveedor de contexto. Proporcionaría el valor de retorno del hook `useSitesPage` a todos sus componentes hijos (`SitesHeader`, `PaginatedResourceView`, etc.), permitiéndoles consumir el estado y las acciones directamente sin necesidad de pasar props.
 * 2. **Abstracción del Diálogo de Creación**: ((Vigente)) El patrón de `Dialog` y `CreateSiteForm` podría ser encapsulado en su propio componente `CreateSiteDialog` para una mayor cohesión, siguiendo el patrón de los diálogos de workspace.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/sites-client.tsx
