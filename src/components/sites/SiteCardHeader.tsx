// src/components/sites/SitesHeader.tsx
/**
 * @file SitesHeader.tsx
 * @description Encabezado soberano para la página "Mis Sitios". Ha sido
 *              refactorizado a un estándar de élite para ser completamente
 *              autocontenido en su consumo de i18n, e implementa una nueva
 *              funcionalidad de ordenamiento y filtrado a través de un Popover.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { Filter, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { type SiteSortOption, type ViewMode } from "@/lib/data/sites";
import { type Enums } from "@/lib/types/database";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";
import { ViewSwitcher } from "./ViewSwitcher";

type SiteStatus = Enums["site_status"] | "all";

/**
 * @public
 * @interface SitesHeaderProps
 * @description Contrato de props para el componente de presentación puro `SitesHeader`.
 *              Define todo el estado y los callbacks que el componente necesita
 *              para renderizar la UI y comunicar las interacciones del usuario
 *              a su orquestador padre.
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
}

/**
 * @public
 * @component SitesHeader
 * @description Renderiza el encabezado completo de la página "Mis Sitios",
 *              incluyendo título, descripción, y controles de UI para ordenar,
 *              filtrar, cambiar la vista, buscar y crear nuevos sitios.
 * @param {SitesHeaderProps} props - Propiedades para configurar el encabezado.
 * @returns {React.ReactElement}
 */
export function SitesHeader({
  searchQuery,
  onSearchChange,
  onCreateSiteClick,
  viewMode,
  onViewChange,
  sortOption,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
}: SitesHeaderProps): React.ReactElement {
  clientLogger.trace(
    "[SitesHeader] Renderizando componente soberano con filtros avanzados."
  );
  const t = useTypedTranslations("components.sites.SitesHeader");
  const tFilters = useTypedTranslations("SitesPage.filters");
  const tStatus = useTypedTranslations("SitesPage.status");

  const sortOptions: { value: SiteSortOption; label: string }[] = [
    {
      value: "created_at_desc",
      label: tFilters("sort_updated_desc"),
    },
    { value: "name_asc", label: tFilters("sort_name_asc") },
    { value: "name_desc", label: tFilters("sort_name_desc") },
  ];

  const statusOptions: { value: SiteStatus; label: string }[] = [
    { value: "all", label: tFilters("status_all") },
    { value: "draft", label: tStatus("draft") },
    { value: "published", label: tStatus("published") },
    { value: "archived", label: tStatus("archived") },
  ];

  const handleClearFilters = () => {
    clientLogger.info("[SitesHeader] Limpiando todos los filtros.");
    onSortChange("created_at_desc");
    onStatusFilterChange("all");
    onSearchChange("");
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <div className="flex w-full md:w-auto items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">{tFilters("sort_label")}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">
                  {tFilters("sort_label")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {tFilters("sort_placeholder")}
                </p>
              </div>
              <RadioGroup
                aria-label={tFilters("sort_label")}
                value={sortOption}
                onValueChange={(value) => onSortChange(value as SiteSortOption)}
              >
                {sortOptions.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="ml-2 font-normal">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="status-filter">
                  {tFilters("status_label")}
                </Label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    onStatusFilterChange(value as SiteStatus)
                  }
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder={tFilters("status_placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="w-full"
              >
                {tFilters("clear_all")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

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
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Implementación de Filtros Avanzados**: ((Implementada)) Se ha implementado la funcionalidad de filtro por estado (`status`) y el botón "Limpiar Filtros", cumpliendo con la directiva holística. La UI del Popover ahora es un centro de control completo para la visualización de datos.
 * 2. **Soberanía de Internacionalización**: ((Implementada)) El componente es 100% soberano, consumiendo `useTypedTranslations` con sus namespaces dedicados (`components.sites.SitesHeader`, `SitesPage.filters`, `SitesPage.status`).
 * 3. **Observabilidad Mejorada**: ((Implementada)) Se ha añadido `clientLogger.info` para registrar la acción de limpiar filtros, proporcionando visibilidad sobre esta interacción clave del usuario.
 *
 * @subsection Melhorias Futuras
 * 1. **Filtros Persistentes**: ((Vigente)) La mejora de élite para este ecosistema sigue siendo la sincronización de los estados de filtro (`sortOption`, `statusFilter`, `searchQuery`) con los `searchParams` de la URL. Propondré implementar esto en la refactorización del hook orquestador `useSitesPage`, que es el lugar arquitectónicamente correcto para manejar esta lógica.
 * 2. **Indicador de Filtros Activos**: ((Pendiente)) El botón del `Popover` de filtros podría mostrar un pequeño indicador visual (ej. un punto de color) cuando hay filtros activos (diferentes a los valores por defecto), para que el usuario tenga una conciencia situacional inmediata.
 *
 * =====================================================================
 */
// src/components/sites/SitesHeader.tsx
