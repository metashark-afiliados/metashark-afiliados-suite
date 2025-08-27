// src/components/sites/SitesHeaderActions.tsx
/**
 * @file SitesHeaderActions.tsx
 * @description Aparato de UI atómico y soberano. Ensambla todos los controles
 *              de acción para el encabezado de la página de sitios. Es un
 *              componente de presentación puro que recibe todo su estado y
 *              manejadores a través de props.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/SearchInput";
import { type SiteSortOption, type ViewMode } from "@/lib/data/sites";
import { type Enums } from "@/lib/types/database";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";
import { SiteFilters } from "./SiteFilters";
import { ViewSwitcher } from "./ViewSwitcher";

type SiteStatus = Enums["site_status"] | "all";

export interface SitesHeaderActionsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateSiteClick: () => void;
  viewMode: ViewMode;
  onViewChange: (view: ViewMode) => void;
  sortOption: SiteSortOption;
  onSortChange: (sort: SiteSortOption) => void;
  statusFilter: SiteStatus;
  onStatusFilterChange: (status: SiteStatus) => void;
  onClearFilters: () => void;
}

export function SitesHeaderActions({
  searchQuery,
  onSearchChange,
  onCreateSiteClick,
  viewMode,
  onViewChange,
  sortOption,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
}: SitesHeaderActionsProps) {
  clientLogger.trace(
    "[SitesHeaderActions] Renderizando ensamblador de acciones soberano."
  );
  const t = useTypedTranslations("components.sites.SitesHeader");

  return (
    <div className="flex w-full md:w-auto items-center gap-2">
      <SiteFilters
        sortOption={sortOption}
        onSortChange={onSortChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        onClearFilters={onClearFilters}
        isSearchActive={searchQuery.length > 0}
      />
      <ViewSwitcher viewMode={viewMode} onViewChange={onViewChange} />
      <SearchInput
        placeholder={t("searchPlaceholder")}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        clearAriaLabel={t("clearSearchAria")}
        className="w-full md:w-52"
      />
      <Button onClick={onCreateSiteClick} className="shrink-0">
        <PlusCircle className="mr-2 h-4 w-4" />
        {t("createSiteButton")}
      </Button>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Hiper-Atomicidad (SRP)**: ((Implementada)) Este nuevo aparato tiene la única responsabilidad de ensamblar los controles de acción, cumpliendo la directiva de atomización y el SRP al más alto nivel.
 * 2. **Soberanía de Internacionalización**: ((Implementada)) El componente es soberano, consumiendo su propio namespace de i18n para los textos que necesita directamente.
 *
 * @subsection Melhorias Futuras
 * 1. **Layout de Acciones Dinámico**: ((Vigente)) El componente podría aceptar un array de configuración (`actions: ('search' | 'filters' | 'view')[]`) para renderizar dinámicamente solo los controles necesarios, aumentando su reutilización en diferentes contextos. Propondré esta mejora para una futura épica de "Componentes de UI Genéricos".
 * 2. **Estado de Carga Granular**: ((Pendiente)) El componente podría aceptar una prop `isPending: boolean` y deshabilitar todos los controles interactivos durante una transición de estado, proporcionando un feedback de UI más robusto.
 *
 * =====================================================================
 */
// src/components/sites/SitesHeaderActions.tsx
