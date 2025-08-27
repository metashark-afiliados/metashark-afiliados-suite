// src/lib/hooks/useSitesPage.ts
/**
 * @file useSitesPage.ts
 * @description Hook orquestador soberano de élite. Ha sido refactorizado
 *              holísticamente para consumir el hook `useUrlStateSync`, proveyendo
 *              filtros persistentes en la URL. Gestiona toda la lógica de estado
 *              (datos, UI, filtros, modales) para la página "Mis Sitios".
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
 * @date 2025-08-26
 */
"use client";

import { useTranslations } from "next-intl";
import React from "react";

import {
  createSiteAction,
  deleteSiteAction,
} from "@/lib/actions/sites.actions";
import {
  type SiteSortOption,
  type SiteStatusFilter,
  type SiteWithCampaignCount,
  type ViewMode,
} from "@/lib/data/sites";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useDialogState } from "@/lib/hooks/ui/useDialogState";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useOptimisticResourceManagement } from "@/lib/hooks/use-optimistic-resource-management";
import { useUrlStateSync } from "@/lib/hooks/ui/useUrlStateSync";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @interface UseSitesPageProps
 * @description Contrato de props para el hook. Define los datos iniciales
 *              obtenidos desde el cargador de datos del servidor.
 */
export interface UseSitesPageProps {
  initialSites: SiteWithCampaignCount[];
  initialSearchQuery: string;
  initialStatusFilter: SiteStatusFilter;
  initialSortOption: SiteSortOption;
}

/**
 * @public
 * @function useSitesPage
 * @description Orquesta todos los hooks y la lógica de estado necesarios para
 *              la página "Mis Sitios". Es la SSoT para la lógica de cliente.
 * @param {UseSitesPageProps} props - Propiedades de inicialización del hook.
 * @returns Un objeto con todo el estado y los manejadores para la UI.
 */
export function useSitesPage({
  initialSites,
  initialSearchQuery,
  initialStatusFilter,
  initialSortOption,
}: UseSitesPageProps) {
  clientLogger.trace("[useSitesPage] Hook soberano inicializado.");
  const t = useTranslations("SitesPage");
  const { activeWorkspace, user } = useDashboard();

  const { state: filters, setState: setFilters } = useUrlStateSync({
    initialState: {
      q: initialSearchQuery,
      status: initialStatusFilter,
      sort: initialSortOption,
    },
    debounceKeys: ["q"],
  });

  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    "sites-view-mode",
    "grid"
  );

  const {
    isOpen: isCreateDialogOpen,
    open: openCreateDialog,
    close: closeCreateDialog,
    setIsOpen: setCreateDialogOpen,
  } = useDialogState();

  const {
    items: sites,
    isPending,
    mutatingId,
    handleCreate: genericHandleCreate,
    handleDelete,
  } = useOptimisticResourceManagement<SiteWithCampaignCount>({
    initialItems: initialSites,
    entityName: t("entityName"),
    createAction: createSiteAction,
    deleteAction: deleteSiteAction,
  });

  const handleCreate = (formData: FormData) => {
    const name = formData.get("name") as string;
    const subdomain = formData.get("subdomain") as string;

    const optimisticSite: Omit<SiteWithCampaignCount, "id"> = {
      name: name || subdomain,
      subdomain,
      workspace_id: activeWorkspace!.id,
      description: (formData.get("description") as string) || null,
      icon: "🌐",
      created_at: new Date().toISOString(),
      updated_at: null,
      owner_id: user.id,
      custom_domain: null,
      status: "draft",
      campaign_count: 0,
    };

    genericHandleCreate?.(formData, optimisticSite);
    closeCreateDialog();
  };

  const handleClearFilters = React.useCallback(() => {
    setFilters({ q: "", status: "all", sort: "created_at_desc" });
  }, [setFilters]);

  return {
    sites,
    activeWorkspaceId: activeWorkspace?.id,
    isPending,
    mutatingId,
    searchQuery: filters.q,
    onSearchChange: (value: string) => setFilters((f) => ({ ...f, q: value })),
    statusFilter: filters.status,
    onStatusFilterChange: (status: SiteStatusFilter) =>
      setFilters((f) => ({ ...f, status })),
    sortOption: filters.sort,
    onSortChange: (sort: SiteSortOption) => setFilters((f) => ({ ...f, sort })),
    onClearFilters: handleClearFilters,
    handleDelete,
    isCreateDialogOpen,
    setCreateDialogOpen,
    openCreateDialog,
    handleCreate,
    viewMode,
    setViewMode,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Filtros Persistentes vía URL**: ((Implementada)) El hook ahora consume `useUrlStateSync` para gestionar `searchQuery`, `statusFilter` y `sortOption`. Esto implementa la persistencia de filtros de forma robusta y escalable, proporcionando una UX de élite.
 * 2. **Desacoplamiento de Lógica de Estado**: ((Implementada)) Se han eliminado las dependencias de `useSearchSync` y `useLocalStorage` para los filtros, centralizando toda la lógica de estado de URL en un único aparato SSoT.
 * 3. **Funcionalidad "Limpiar Filtros"**: ((Implementada)) Se ha añadido el manejador `handleClearFilters` que resetea el estado de los filtros a sus valores por defecto.
 *
 * @subsection Melhorias Futuras
 * 1. **Indicador de Carga de Sincronización**: ((Vigente)) El hook `useUrlStateSync` devuelve un booleano `isSyncing`. Propondré pasar este estado al `SitesHeader` para que pueda mostrar un indicador de carga (ej. en el `SearchInput`) mientras la URL se está actualizando, mejorando el feedback al usuario.
 * 2. **Abstracción de `handleCreate`**: ((Pendiente)) La lógica para construir el `optimisticSite` es específica de la entidad "Site". Para que `useOptimisticResourceManagement` sea verdaderamente genérico, esta lógica de construcción del item optimista podría ser pasada como un callback al hook, en lugar de residir aquí.
 *
 * =====================================================================
 */
// src/lib/hooks/useSitesPage.ts
