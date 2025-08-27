// src/components/sites/SitesHeader.tsx
/**
 * @file SitesHeader.tsx
 * @description Orquestador de layout de máxima élite. Ha sido refactorizado
 *              radicalmente a un ensamblador puro que compone los aparatos
 *              atómicos soberanos `SitesPageTitle` y `SitesHeaderActions`,
 *              cumpliendo con la "Filosofía LEGO" al más alto nivel.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";

import { type SiteSortOption, type ViewMode } from "@/lib/data/sites";
import { type Enums } from "@/lib/types/database";
import { clientLogger } from "@/lib/logging";
import { SitesHeaderActions } from "./SitesHeaderActions";
import { SitesPageTitle } from "./SitesPageTitle";

type SiteStatus = Enums["site_status"] | "all";

/**
 * @public
 * @interface SitesHeaderProps
 * @description Contrato de props para el orquestador de layout `SitesHeader`.
 *              Define todo el estado y los callbacks necesarios para sus hijos atómicos.
 */
export interface SitesHeaderProps {
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

/**
 * @public
 * @component SitesHeader
 * @description Orquesta el layout del encabezado de la página "Mis Sitios",
 *              ensamblando los componentes atómicos para el título y los controles.
 * @param {SitesHeaderProps} props - Propiedades para configurar el encabezado.
 * @returns {React.ReactElement}
 */
export function SitesHeader({
  ...props
}: SitesHeaderProps): React.ReactElement {
  clientLogger.trace(
    "[SitesHeader] Renderizando orquestador de layout de élite."
  );

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
      <SitesPageTitle />
      <SitesHeaderActions {...props} />
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP) a Nivel de Orquestador**: ((Implementada)) El componente `SitesHeader` ha alcanzado su forma más pura. Su única responsabilidad es el layout, delegando toda la presentación y lógica a sus hijos. Esta es la implementación canónica de un "componente ensamblador".
 * 2. **Máxima Legibilidad y Mantenibilidad**: ((Implementada)) La complejidad del componente ha sido drásticamente reducida. Ahora es trivialmente simple de leer, entender y mantener.
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción a `ResourcePageHeader`**: ((Vigente)) El patrón `Título | Acciones` ahora es tan limpio y claro que la creación de un componente genérico `ResourcePageHeader.tsx` que acepte `titleComponent` y `actionsComponent` como slots se vuelve el siguiente paso lógico de élite para maximizar la reutilización en toda la aplicación (ej. en la página de Campañas). Propondré esta épica de refactorización de UI a continuación.
 *
 * =====================================================================
 */
// src/components/sites/SitesHeader.tsx
