// src/lib/hooks/useSitesPage.ts
/**
 * @file useSitesPage.ts
 * @description Hook orquestador soberano de élite. Encapsula toda la lógica de
 *              estado y negocio para la página "Mis Sitios", incluyendo filtros
 *              sincronizados con URL, gestión de vista, UI optimista y manejo
 *              de diálogos.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

import {
  createSiteAction,
  deleteSiteAction,
} from "@/lib/actions/sites.actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import {
  type SiteSortOption,
  type SiteStatusFilter,
  type SiteWithCampaignCount,
  type ViewMode,
} from "@/lib/data/sites/types";
import { useDialogState } from "@/lib/hooks/ui/useDialogState";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useUrlStateSync } from "@/lib/hooks/ui/useUrlStateSync";
import { clientLogger } from "@/lib/logging";
import { useOptimisticResourceManagement } from "./use-optimistic-resource-management";

export interface UseSitesPageProps {
  initialSites: SiteWithCampaignCount[];
  initialSearchQuery: string;
  initialStatusFilter: SiteStatusFilter;
  initialSortOption: SiteSortOption;
}

export function useSitesPage({
  initialSites,
  initialSearchQuery,
  initialStatusFilter,
  initialSortOption,
}: UseSitesPageProps) {
  clientLogger.trace("[useSitesPage] Hook soberano inicializado.");
  const t = useTranslations("SitesPage");
  const { activeWorkspace, user } = useDashboard();
  const router = useRouter();

  const {
    state: filters,
    setState: setFilters,
    isSyncing,
  } = useUrlStateSync({
    initialState: {
      q: initialSearchQuery,
      status: initialStatusFilter,
      sort: initialSortOption,
    },
    debounceKeys: ["q"],
  });

  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    "sites-view-mode",
    "grid"
  );

  const {
    isOpen: isCreateDialogOpen,
    open: openCreateDialog,
    close: closeCreateDialog,
    setIsOpen: setCreateDialogOpen,
  } = useDialogState();

  const createOptimisticSite = (formData: FormData): SiteWithCampaignCount => {
    const name = formData.get("name") as string;
    const subdomain = formData.get("subdomain") as string;
    return {
      id: `optimistic-${Date.now()}`,
      name: name || subdomain,
      subdomain,
      workspace_id: activeWorkspace!.id,
      description: (formData.get("description") as string) || null,
      icon: "🌐",
      created_at: new Date().toISOString(),
      updated_at: null,
      owner_id: user.id,
      custom_domain: null,
      status: "draft",
      campaign_count: 0,
    };
  };

  const {
    items: sites,
    isPending,
    mutatingId,
    handleCreate: genericHandleCreate,
    handleDelete: genericHandleDelete,
  } = useOptimisticResourceManagement<SiteWithCampaignCount>({
    initialItems: initialSites,
    createAction: createSiteAction,
    deleteAction: deleteSiteAction,
    createOptimisticItem: createOptimisticSite,
  });

  const handleCreate = async (formData: FormData) => {
    if (!genericHandleCreate) return;
    const result = await genericHandleCreate(formData);
    if (result.success) {
      toast.success(t("entityName") + " creado con éxito.");
      router.refresh();
    } else {
      toast.error(result.error);
    }
    closeCreateDialog();
  };

  const handleDelete = async (formData: FormData) => {
    if (!genericHandleDelete) return;
    const result = await genericHandleDelete(formData);
    if (result.success) {
      toast.success(t("entityName") + " eliminado con éxito.");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const handleClearFilters = React.useCallback(() => {
    clientLogger.info("[useSitesPage] Limpiando todos los filtros.");
    setFilters({ q: "", status: "all", sort: "created_at_desc" });
  }, [setFilters]);

  return {
    sites,
    activeWorkspaceId: activeWorkspace?.id,
    isPending,
    mutatingId,
    isSyncing,
    searchQuery: filters.q,
    onSearchChange: (value: string) => setFilters((f) => ({ ...f, q: value })),
    statusFilter: filters.status as SiteStatusFilter,
    onStatusFilterChange: (status: SiteStatusFilter) =>
      setFilters((f) => ({ ...f, status })),
    sortOption: filters.sort as SiteSortOption,
    onSortChange: (sort: SiteSortOption) => setFilters((f) => ({ ...f, sort })),
    onClearFilters: handleClearFilters,
    handleDelete,
    isCreateDialogOpen,
    setCreateDialogOpen,
    openCreateDialog,
    handleCreate,
    viewMode,
    setViewMode,
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Encapsulamiento Holístico (SRP)**: Este hook soberano se convierte en el "cerebro" de la página, encapsulando toda la lógica de estado (filtros, vista, diálogos, UI optimista) y las acciones. Esto permite que el componente `sites-client.tsx` se convierta en un presentador puro y simple.
 * 2. ((Implementada)) **Composición de Hooks de Élite**: Demuestra un patrón de élite al componer múltiples hooks atómicos (`useUrlStateSync`, `useLocalStorage`, `useDialogState`, `useOptimisticResourceManagement`) para construir una lógica compleja de forma cohesiva y mantenible.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Factoría de Items Optimistas Atómica**: La lógica de `createOptimisticSite` es específica de esta entidad. Para una reutilización máxima, podría ser extraída a un archivo de factorías (`/lib/factories/optimistic-items.ts`) si otros hooks necesitaran crear sitios optimistas.
 *
 * =====================================================================
 */
// src/lib/hooks/useSitesPage.ts
