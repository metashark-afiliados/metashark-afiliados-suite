// src/lib/hooks/use-campaign-filters.ts
"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "@/lib/navigation";
import { useDebounce } from "./use-debounce";

type CampaignStatus = "draft" | "published" | "archived";
type SortByOption = "updated_at_desc" | "name_asc";

interface UseCampaignFiltersProps {
  initialSearchQuery: string;
  initialStatus?: CampaignStatus;
  initialSortBy?: SortByOption;
}

/**
 * @public
 * @function useCampaignFilters
 * @description Hook atómico que gestiona el estado de los filtros de la página
 *              de campañas y lo sincroniza con los searchParams de la URL.
 * @param {UseCampaignFiltersProps} props - El estado inicial de los filtros.
 * @returns El estado de los filtros y sus setters.
 * @version 1.0.0
 * @author Raz Podestá
 */
export function useCampaignFilters({
  initialSearchQuery,
  initialStatus,
  initialSortBy,
}: UseCampaignFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | undefined>(
    initialStatus
  );
  const [sortBy, setSortBy] = useState<SortByOption>(
    initialSortBy || "updated_at_desc"
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const updateParam = (key: string, value: string | undefined) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };

    updateParam("q", debouncedSearchTerm);
    updateParam("status", statusFilter);
    updateParam("sortBy", sortBy);
    if (debouncedSearchTerm || statusFilter || sortBy) params.set("page", "1");

    router.push(`${pathname}?${params.toString()}` as any, { scroll: false });
  }, [debouncedSearchTerm, statusFilter, sortBy, pathname, router]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (Lógica de UI)**: ((Implementada)) Aísla la lógica de filtros.
 *
 * =====================================================================
 */
