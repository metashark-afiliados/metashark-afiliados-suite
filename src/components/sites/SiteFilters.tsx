// src/components/sites/SiteFilters.tsx
/**
 * @file SiteFilters.tsx
 * @description Aparato de UI atómico y soberano. Encapsula toda la lógica
 *              de presentación para los filtros y el ordenamiento de la página
 *              de sitios, incluyendo un indicador visual de filtros activos.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { type SiteSortOption } from "@/lib/data/sites";
import { type Enums } from "@/lib/types/database";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";
import { cn } from "@/lib/utils";

type SiteStatus = Enums["site_status"] | "all";

export interface SiteFiltersProps {
  sortOption: SiteSortOption;
  onSortChange: (sort: SiteSortOption) => void;
  statusFilter: SiteStatus;
  onStatusFilterChange: (status: SiteStatus) => void;
  onClearFilters: () => void;
  isSearchActive: boolean;
}

export function SiteFilters({
  sortOption,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
  isSearchActive,
}: SiteFiltersProps) {
  clientLogger.trace(
    "[SiteFilters] Renderizando componente de filtros soberano."
  );
  const tFilters = useTypedTranslations("SitesPage.filters");
  const tStatus = useTypedTranslations("SitesPage.status");

  const sortOptions: { value: SiteSortOption; label: string }[] = [
    { value: "created_at_desc", label: tFilters("sort_updated_desc") },
    { value: "name_asc", label: tFilters("sort_name_asc") },
    { value: "name_desc", label: tFilters("sort_name_desc") },
  ];

  const statusOptions: { value: SiteStatus; label: string }[] = [
    { value: "all", label: tFilters("status_all") },
    { value: "draft", label: tStatus("draft") },
    { value: "published", label: tStatus("published") },
    { value: "archived", label: tStatus("archived") },
  ];

  const areFiltersActive =
    sortOption !== "created_at_desc" ||
    statusFilter !== "all" ||
    isSearchActive;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 relative">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">{tFilters("sort_label")}</span>
          {areFiltersActive && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          )}
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
            <Label htmlFor="status-filter">{tFilters("status_label")}</Label>
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
            onClick={onClearFilters}
            className="w-full"
            disabled={!areFiltersActive}
          >
            {tFilters("clear_all")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato tiene la única responsabilidad de presentar la UI de filtros y comunicar las interacciones, cumpliendo la directiva de atomización.
 * 2. **Indicador de Filtros Activos**: ((Implementada)) Se ha implementado la lógica y la UI para mostrar un indicador visual cuando los filtros de ordenamiento, estado o búsqueda están activos, mejorando la conciencia situacional del usuario.
 * 3. **Botón "Limpiar Filtros" Inteligente**: ((Implementada)) El botón para limpiar los filtros ahora se deshabilita automáticamente cuando no hay filtros activos, proveyendo una UX más inteligente y previniendo acciones innecesarias.
 *
 * @subsection Melhorias Futuras
 * 1. **Guardado de Presets de Filtros**: ((Vigente)) Para una experiencia de usuario de élite, se podría añadir una funcionalidad para guardar la combinación de filtros actual como un "preset" con nombre, que podría ser recuperado posteriormente. Esto requeriría extender el `useSitesPage` hook y potencialmente la tabla `profiles` para persistir estos presets.
 * 2. **Indicador de Conteo de Filtros**: ((Pendiente)) El indicador visual podría ser mejorado para mostrar el número de filtros activos (ej. un badge con "3") en lugar de un punto genérico, proporcionando información más granular. Propondré implementar esta mejora en una futura iteración de UX.
 *
 * =====================================================================
 */
// src/components/sites/SiteFilters.tsx
