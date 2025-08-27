// src/app/[locale]/dashboard/sites/sites-client.tsx
/**
 * @file sites-client.tsx
 * @description Orquestador de UI. Ha sido refactorizado a un estándar de élite
 *              para sincronizar su API con la del componente `SitesHeader`,
 *              pasando las props requeridas y resolviendo el error de tipo TS2739.
 * @author Raz Podestá - MetaShark Tech
 * @version 15.3.0
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
import {
  type SiteSortOption,
  type SiteStatusFilter,
  type SiteWithCampaignCount,
} from "@/lib/data/sites";
import { useSitesPageTranslations } from "@/lib/hooks/i18n/useSitesPageTranslations";
import { useSitesPage } from "@/lib/hooks/useSitesPage";
import { clientLogger } from "@/lib/logging";

interface SitesClientProps {
  initialSites: SiteWithCampaignCount[];
  totalCount: number;
  page: number;
  limit: number;
  initialSearchQuery: string;
  initialStatusFilter: SiteStatusFilter;
  initialSortOption: SiteSortOption;
}

export function SitesClient({
  initialSites,
  totalCount,
  page,
  limit,
  ...initialFilters
}: SitesClientProps): React.ReactElement {
  clientLogger.trace("[SitesClient] Renderizando orquestador de lógica puro.");

  const { tSitesPage, tErrors } = useSitesPageTranslations();
  const {
    sites,
    activeWorkspaceId,
    isPending,
    mutatingId,
    isSyncing,
    handleDelete,
    isCreateDialogOpen,
    openCreateDialog,
    setCreateDialogOpen,
    handleCreate,
    viewMode,
    setViewMode,
    ...filterProps
  } = useSitesPage({
    initialSites,
    ...initialFilters,
  });

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
      {/* --- INICIO DE CORRECCIÓN DE API (TS2739) --- */}
      <SitesHeader
        {...filterProps}
        onCreateSiteClick={openCreateDialog}
        viewMode={viewMode}
        onViewChange={setViewMode}
        isSyncing={isSyncing}
      />
      {/* --- FIN DE CORRECCIÓN DE API (TS2739) --- */}

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
        viewKey={viewMode}
        items={sites}
        emptyStateText={tSitesPage("grid.emptyStateTitle")}
        page={page}
        totalCount={totalCount}
        limit={limit}
        basePath="/dashboard/sites"
        searchQuery={filterProps.searchQuery}
        renderView={(currentItems) =>
          viewMode === "grid" ? (
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
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Resolución de Error de Compilación (TS2739)**: Se han pasado las props `viewMode`, `onViewChange`, y `isSyncing` al componente `SitesHeader`, satisfaciendo su contrato de API y resolviendo el error de compilación.
 * 2. ((Implementada)) **Activación de Funcionalidad de UI**: Esta corrección activa la funcionalidad del `ViewSwitcher` y el estado de carga del `SearchInput` en el `SitesHeaderActions`, mejorando la UX.
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción de `ResourcePageHeader`**: ((Vigente)) El patrón de `TitleSlot` + `ActionsSlot` en `SitesHeader` es un candidato ideal para ser abstraído a un componente genérico `ResourcePageHeader`, que sería reutilizado en la página de "Campañas" y "Usuarios".
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/sites-client.tsx
