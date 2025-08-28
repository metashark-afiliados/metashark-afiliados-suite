// src/lib/hooks/useSitesHeader.ts
/**
 * @file useSitesHeader.ts
 * @description Hook soberano y atómico que encapsula toda la lógica de estado y
 *              acciones para el encabezado de la página "Mis Sitios". Gestiona
 *              los filtros, la búsqueda, el cambio de vista y la sincronización
 *              con la URL, actuando como el "cerebro" para los componentes de UI
 *              del encabezado.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";

import {
  type SiteSortOption,
  type SiteStatusFilter,
  type ViewMode,
} from "@/lib/data/sites/types";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useUrlStateSync } from "@/lib/hooks/ui/useUrlStateSync";
import { clientLogger } from "@/lib/logging";

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
    clientLogger.info("[useSitesHeader] Limpiando todos los filtros.");
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
    setViewMode,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @subsection Melhorias Futuras
 * 1. **Contexto de Encabezado (`SitesHeaderContext`)**: ((Vigente)) Para una pureza arquitectónica de élite y para eliminar completamente el "prop drilling", el valor de retorno de este hook podría ser proporcionado a través de un `SitesHeaderContext`. Esto permitiría que componentes anidados profundamente (como un botón dentro de `SiteFilters`) accedan al estado y a las acciones sin que cada componente intermedio tenga que pasar las props.
 * 2. **Estado de Filtros Activos**: ((Vigente)) El hook podría computar y devolver un booleano `areFiltersActive`. Esto simplificaría la lógica en el componente `SiteFilters` para mostrar el indicador de notificación y habilitar el botón "Limpiar Filtros", adhiriéndose aún más al SRP.
 *
 * =====================================================================
 */
// src/lib/hooks/useSitesHeader.ts
