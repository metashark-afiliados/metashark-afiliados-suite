// src/app/[locale]/dashboard/sites/sites-client.tsx
/**
 * @file sites-client.tsx
 * @description Orquestador de lógica y estado puro. Ha sido refactorizado
 *              a un estándar de élite para consumir la nueva API del hook
 *              `useSitesPage`, orquestando la funcionalidad completa de filtros
 *              persistentes y vista dual.
 * @author Raz Podestá - MetaShark Tech
 * @version 13.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { ErrorStateCard } from "@/components/shared/error-state-card";
import { PaginationControls } from "@/components/shared/pagination-controls";
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
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { useSitesPage } from "@/lib/hooks/use-sites-page";
import { clientLogger } from "@/lib/logging";

const MemoizedSitesGrid = React.memo(SitesGrid);
const MemoizedSitesTable = React.memo(SitesTable);

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
    viewMode,
    setViewMode,
    ...filterProps
  } = useSitesPage({
    initialSites,
    initialSearchQuery: initialFilters.initialSearchQuery,
    initialStatusFilter: initialFilters.initialStatusFilter,
    initialSortOption: initialFilters.initialSortOption,
  });

  const { tSitesPage, tErrors } = useDashboardTranslations();

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
      <SitesHeader
        searchQuery={filterProps.searchQuery}
        onSearchChange={filterProps.onSearchChange}
        onCreateSiteClick={openCreateDialog}
        viewMode={viewMode}
        onViewChange={setViewMode}
        sortOption={filterProps.sortOption}
        onSortChange={filterProps.onSortChange}
        statusFilter={filterProps.statusFilter}
        onStatusFilterChange={filterProps.onStatusFilterChange}
        onClearFilters={filterProps.onClearFilters}
      />

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

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === "grid" ? (
            <MemoizedSitesGrid
              sites={sites}
              onDelete={handleDelete!}
              isPending={isPending}
              deletingSiteId={mutatingId}
            />
          ) : (
            <MemoizedSitesTable
              sites={sites}
              onDelete={handleDelete!}
              isPending={isPending}
              deletingSiteId={mutatingId}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <PaginationControls
        page={page}
        totalCount={totalCount}
        limit={limit}
        basePath="/dashboard/sites"
        searchQuery={filterProps.searchQuery}
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
 * 1. **Integración Completa de Filtros**: ((Implementada)) Este orquestador ahora consume la API completa del hook `useSitesPage` y pasa todas las props de estado y manejadores de filtros (`sortOption`, `statusFilter`, etc.) a sus hijos `SitesHeader` y `PaginationControls`. Esto completa la funcionalidad de filtros persistentes.
 * 2. **Desacoplamiento de UI**: ((Vigente)) El componente se mantiene como un orquestador de lógica puro, delegando toda la presentación a sus hijos atomizados.
 *
 * @subsection Melhorias Futuras
 * 1. **Indicador de Carga de Sincronización**: ((Pendiente)) El hook `useUrlStateSync` (consumido por `useSitesPage`) devuelve un booleano `isSyncing`. Propondré pasar este estado a `SitesHeader` para que pueda mostrar un indicador de carga en el `SearchInput` o en los filtros mientras la URL se actualiza.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/sites-client.tsx
