// src/components/sites/SitesHeaderActions.tsx
/**
 * @file SitesHeaderActions.tsx
 * @description Aparato de UI atómico y de ensamblaje puro. Su única
 *              responsabilidad es componer los controles interactivos del
 *              encabezado de la página "Mis Sitios". Es 100% agnóstico al
 *              estado y consume sus propias traducciones.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  type SiteSortOption,
  type SiteStatusFilter,
  type ViewMode,
} from "@/lib/data/sites";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";
import { SiteFilters } from "./SiteFilters";
import { ViewSwitcher } from "./ViewSwitcher";

export interface SitesHeaderActionsProps {
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
  isSyncing,
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
        isLoading={isSyncing}
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
 * 1. **Componente de Ensamblaje Puro (LEGO)**: ((Implementada)) Este aparato ahora cumple perfectamente con la "Filosofía LEGO". Es un ensamblador puro que compone otros átomos de UI (`SiteFilters`, `ViewSwitcher`, etc.), sin contener lógica de estado propia.
 * 2. **Soberanía de I18n**: ((Implementada)) El componente es autocontenido en su consumo de traducciones, mejorando la modularidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción a `ResourceHeaderActions`**: ((Vigente)) El patrón de "Filtros + Switcher de Vista + Búsqueda + Botón de Crear" es altamente reutilizable y será necesario para la página de "Campañas" y "Usuarios". Propondré la creación de un componente genérico `ResourceHeaderActions` en la siguiente épica de refactorización de UI para maximizar el cumplimiento del principio DRY.
 * 2. **Estado de Carga Granular**: ((Pendiente)) El componente podría aceptar una prop `isPending` general y deshabilitar todos los controles interactivos durante una transición de estado, proporcionando un feedback de UI más consistente.
 *
 * =====================================================================
 */
// src/components/sites/SitesHeaderActions.tsx
