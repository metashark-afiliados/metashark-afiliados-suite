// src/components/sites/SiteFilters.tsx
/**
 * @file SiteFilters.tsx
 * @description Aparato de UI atómico y soberano. Refactorizado para consumir
 *              el namespace de i18n correcto, resolviendo la cascada de
 *              errores de tipo TS2345.
 * @author L.I.A. Legacy
 * @version 8.0.0
 * @see .docs-espejo/components/sites/SiteFilters.tsx.md
 */
"use client";

import { Filter } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupOption } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  type SiteSortOption,
  type SiteStatusFilter,
} from "@/lib/data/sites/types";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logger";

export interface SiteFiltersProps {
  sortOption: SiteSortOption;
  onSortChange: (sort: SiteSortOption) => void;
  statusFilter: SiteStatusFilter;
  onStatusFilterChange: (status: SiteStatusFilter) => void;
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

  const tSitesPage = useTypedTranslations("app.[locale].dashboard.sites.page");

  const sortOptions: { value: SiteSortOption; label: string }[] = [
    {
      value: "created_at_desc",
      label: tSitesPage("filters.sort_updated_desc"),
    },
    { value: "name_asc", label: tSitesPage("filters.sort_name_asc") },
    { value: "name_desc", label: tSitesPage("filters.sort_name_desc") },
  ];

  const statusOptions: { value: SiteStatusFilter; label: string }[] = [
    { value: "all", label: tSitesPage("filters.status_all") },
    { value: "draft", label: tSitesPage("status.draft") },
    { value: "published", label: tSitesPage("status.published") },
    { value: "archived", label: tSitesPage("status.archived") },
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
          <span className="hidden sm:inline">
            {tSitesPage("filters.sort_label")}
          </span>
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
              {tSitesPage("filters.sort_label")}
            </h4>
            <p className="text-sm text-muted-foreground">
              {tSitesPage("filters.sort_placeholder")}
            </p>
          </div>
          <RadioGroup
            aria-label={tSitesPage("filters.sort_label")}
            value={sortOption}
            onValueChange={(value: string) =>
              onSortChange(value as SiteSortOption)
            }
          >
            {sortOptions.map((option) => (
              <RadioGroupOption key={option.value} value={option.value}>
                {option.label}
              </RadioGroupOption>
            ))}
          </RadioGroup>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="status-filter">
              {tSitesPage("filters.status_label")}
            </Label>
            <Select
              value={statusFilter}
              onValueChange={(value: string) =>
                onStatusFilterChange(value as SiteStatusFilter)
              }
            >
              <SelectTrigger id="status-filter">
                <SelectValue
                  placeholder={tSitesPage("filters.status_placeholder")}
                />
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
            {tSitesPage("filters.clear_all")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
// src/components/sites/SiteFilters.tsx
