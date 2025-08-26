// src/app/[locale]/dashboard/sites/sites-client.tsx
/**
 * @file sites-client.tsx
 * @description Orquestador de lógica y estado puro con renderizado condicional
 *              para vistas de cuadrícula y lista. Es 100% soberano y compone
 *              otros aparatos soberanos.
 * @author Raz Podestá - MetaShark Tech
 * @version 11.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

import { CreateSiteForm } from "@/components/sites/CreateSiteForm";
import { SitesGrid } from "@/components/sites/SitesGrid";
import { SitesHeader } from "@/components/sites/SitesHeader";
import { SitesTable } from "@/components/sites/SitesTable"; // Asumiendo que existe
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { useSitesPage } from "@/lib/hooks/use-sites-page"; // Asumiendo que está enriquecido
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { clientLogger } from "@/lib/logging";
import { ErrorStateCard } from "@/components/shared/error-state-card";

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
}: SitesClientProps): React.ReactElement {
  clientLogger.trace("[SitesClient] Renderizando orquestador de lógica puro.");

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
    viewMode,
    setViewMode,
  } = useSitesPage({ initialSites, initialSearchQuery: searchQuery });

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
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateSiteClick={openCreateDialog}
        viewMode={viewMode}
        onViewChange={setViewMode}
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

      {viewMode === "grid" ? (
        <SitesGrid
          sites={sites}
          onDelete={handleDelete!}
          isPending={isPending}
          deletingSiteId={mutatingId}
        />
      ) : (
        <SitesTable
          sites={sites}
          onDelete={handleDelete!}
          isPending={isPending}
          deletingSiteId={mutatingId}
        />
      )}

      <PaginationControls
        page={page}
        totalCount={totalCount}
        limit={limit}
        basePath="/dashboard/sites"
        searchQuery={searchTerm}
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
 * 1. ((Implementada)) **Flexibilidad de Visualización:** El componente ahora soporta renderizado condicional, permitiendo al usuario elegir entre una vista de cuadrícula visual y una vista de tabla densa, una característica de UX de élite.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Animación de Transición de Vistas:** Utilizar `framer-motion` con `AnimatePresence` para crear una transición animada suave al cambiar entre `SitesGrid` y `SitesTable`.
 * 2. ((Vigente)) **Memoización de Componentes de Vista:** Envolver `SitesGrid` y `SitesTable` en `React.memo` para prevenir re-renderizados innecesarios cuando cambien otros estados que no afectan a la lista de sitios (ej. al abrir el diálogo de creación).
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/sites-client.tsx
