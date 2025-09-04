// src/components/sites/SiteFilters.tsx
/**
 * @file SiteFilters.tsx
 * @description Aparato de UI atómico y soberano. Refactorizado para consumir
 *              `useTypedTranslations` con namespaces anidados, resolviendo la
 *              cascada de errores de tipo TS2322 y restaurando la seguridad
 *              de tipos de i18n.
 * @author L.I.A. Legacy
 * @version 5.0.0
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

  const tFilters = useTypedTranslations("components.sites.SitesHeader.filters");
  const tStatus = useTypedTranslations("components.sites.SitesHeader.status");

  const sortOptions: { value: SiteSortOption; label: string }[] = [
    { value: "created_at_desc", label: tFilters("sort_updated_desc") },
    { value: "name_asc", label: tFilters("sort_name_asc") },
    { value: "name_desc", label: tFilters("sort_name_desc") },
  ];

  const statusOptions: { value: SiteStatusFilter; label: string }[] = [
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
            <Label htmlFor="status-filter">{tFilters("status_label")}</Label>
            <Select
              value={statusFilter}
              onValueChange={(value: string) =>
                onStatusFilterChange(value as SiteStatusFilter)
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
// src/components/sites/SiteFilters.tsx
