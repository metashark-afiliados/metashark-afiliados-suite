// src/components/sites/SitesHeader.tsx
/**
 * @file SitesHeader.tsx
 * @description Orquestador de UI de élite para el encabezado de "Mis Sitios".
 *              Ha sido refactorizado holísticamente para consumir el componente
 *              de layout abstracto `ResourcePageHeader`, delegando toda la
 *              lógica de layout y cumpliendo el principio DRY al más alto nivel.
 * @author Raz Podestá - MetaShark Tech
 * @version 7.0.0
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
import { clientLogger } from "@/lib/logging";
import { ResourcePageHeader } from "@/components/shared/ResourcePageHeader";
import { SitesHeaderActions } from "./SitesHeaderActions";
import { SitesPageTitle } from "./SitesPageTitle";

export interface SitesHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateSiteClick: () => void;
  viewMode: ViewMode;
  onViewChange: (view: ViewMode) => void;
  sortOption: SiteSortOption;
  onSortChange: (sort: SiteSortOption) => void;
  statusFilter: SiteStatusFilter;
  onStatusFilterChange: (status: SiteStatusFilter) => void;
  onClearFilters: () => void;
  isSyncing: boolean;
}

export function SitesHeader({
  ...props
}: SitesHeaderProps): React.ReactElement {
  clientLogger.trace(
    "[SitesHeader] Renderizando orquestador de UI consumiendo abstracción."
  );

  return (
    // --- INICIO DE IMPLEMENTACIÓN DE ABSTRACCIÓN HOLÍSTICA ---
    <ResourcePageHeader
      titleSlot={<SitesPageTitle />}
      actionsSlot={<SitesHeaderActions {...props} />}
    />
    // --- FIN DE IMPLEMENTACIÓN DE ABSTRACCIÓN HOLÍSTICA ---
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Adopción de Abstracción de Layout (DRY)**: ((Implementada)) El componente ahora consume `ResourcePageHeader`. Toda la lógica de `flex`, `justify-between`, etc., ha sido delegada al componente abstracto, haciendo que `SitesHeader` sea un orquestador de composición puro, más simple y declarativo.
 * 2. **Simplificación Radical**: ((Implementada)) El JSX del componente se ha reducido a su mínima expresión, mejorando drásticamente la legibilidad y la mantenibilidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Consolidación de Props**: ((Vigente)) El componente todavía pasa un gran número de props a `SitesHeaderActions`. Una futura refactorización de élite podría ser crear un `useSitesHeader` hook que gestione este estado y lo provea a través de un contexto, simplificando aún más el paso de props.
 *
 * =====================================================================
 */
// src/components/sites/SitesHeader.tsx
