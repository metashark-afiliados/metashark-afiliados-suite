// src/lib/hooks/useSitesHeader.ts
/**
 * @file useSitesHeader.ts
 * @description Hook soberano y atómico que encapsula toda la lógica de estado y
 *              acciones para el encabezado de la página "Mis Sitios". Ha sido
 *              refactorizado para alinear su contrato de API y tipos con sus
 *              dependencias y consumidores, resolviendo una cascada de errores.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 */
"use client";

import React from "react";

import {
  type SiteSortOption,
  type SiteStatusFilter,
  type ViewMode,
} from "@/lib/data/sites/types";
import { useUrlStateSync } from "@/lib/hooks/ui/useUrlStateSync";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { clientLogger } from "@/lib/logger";

export interface UseSitesHeaderProps {
  initialSearchQuery: string;
  initialStatusFilter: SiteStatusFilter;
  initialSortOption: SiteSortOption;
}

type SiteFiltersState = {
  q: string;
  status: SiteStatusFilter;
  sort: SiteSortOption;
};

/**
 * @public
 * @function useSitesHeader
 * @description Orquesta el estado y las acciones para el encabezado de la página de sitios.
 * @param {UseSitesHeaderProps} props - Propiedades iniciales para el estado de los filtros.
 * @returns La API completa para gestionar la UI del encabezado.
 */
export function useSitesHeader(props: UseSitesHeaderProps) {
  clientLogger.trace(
    {},
    "[useSitesHeader] Inicializando hook soberano para el encabezado."
  );

  const {
    state: filters,
    setState: setFilters,
    isSyncing,
  } = useUrlStateSync<SiteFiltersState>({
    initialState: {
      q: props.initialSearchQuery,
      status: props.initialStatusFilter,
      sort: props.initialSortOption,
    },
    debounceKeys: ["q"],
  });

  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    "sites-view-mode",
    "grid"
  );

  const handleClearFilters = React.useCallback(() => {
    clientLogger.info({}, "[useSitesHeader] Limpiando todos los filtros.");
    setFilters({ q: "", status: "all", sort: "created_at_desc" });
  }, [setFilters]);

  return {
    isSyncing,
    searchQuery: filters.q,
    onSearchChange: (value: string) => setFilters((f) => ({ ...f, q: value })),
    statusFilter: filters.status,
    onStatusFilterChange: (status: SiteStatusFilter) =>
      setFilters((f) => ({ ...f, status })),
    sortOption: filters.sort,
    onSortChange: (sort: SiteSortOption) => setFilters((f) => ({ ...f, sort })),
    onClearFilters: handleClearFilters,
    viewMode,
    onViewChange: setViewMode,
  };
}
// src/lib/hooks/useSitesHeader.ts
