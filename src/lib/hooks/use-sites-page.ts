// src/lib/hooks/use-sites-page.ts
"use client";

import { useTranslations } from "next-intl";

import {
  createSiteAction,
  deleteSiteAction,
} from "@/lib/actions/sites.actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { useOptimisticResourceManagement } from "@/lib/hooks/use-optimistic-resource-management";
import { useDialogState } from "@/lib/hooks/ui/useDialogState";
import { useSearchSync } from "@/lib/hooks/ui/useSearchSync";
import { logger } from "@/lib/logging";

/**
 * @public
 * @function useSitesPage
 * @description Hook orquestador que encapsula toda la lógica de la página "Mis Sitios".
 * @param {{ initialSites: SiteWithCampaignCount[], initialSearchQuery: string }} params
 * @returns Un objeto con todo el estado y los manejadores necesarios para la UI.
 * @version 3.1.0
 * @author Raz Podestá
 */
export function useSitesPage({
  initialSites,
  initialSearchQuery,
}: {
  initialSites: SiteWithCampaignCount[];
  initialSearchQuery: string;
}) {
  logger.trace("[useSitesPage] Hook orquestador inicializado.");
  const t = useTranslations("SitesPage");
  const { activeWorkspace, user } = useDashboard();

  const { searchTerm, setSearchTerm } = useSearchSync({
    initialQuery: initialSearchQuery,
  });
  const {
    isOpen: isCreateDialogOpen,
    open: openCreateDialog,
    close: closeCreateDialog,
    setIsOpen: setCreateDialogOpen,
  } = useDialogState();

  const {
    items: sites,
    isPending,
    mutatingId,
    handleCreate: genericHandleCreate,
    handleDelete,
  } = useOptimisticResourceManagement<SiteWithCampaignCount>({
    initialItems: initialSites,
    entityName: t("entityName"),
    createAction: createSiteAction,
    deleteAction: deleteSiteAction,
  });

  const handleCreate = (formData: FormData) => {
    const name = formData.get("name") as string;
    const subdomain = formData.get("subdomain") as string;
    logger.trace(`[useSitesPage] Acción de creación iniciada`, {
      name,
      subdomain,
      workspaceId: activeWorkspace?.id,
    });

    const optimisticSite: Omit<SiteWithCampaignCount, "id"> = {
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

    genericHandleCreate?.(formData, optimisticSite);
    closeCreateDialog();
  };

  return {
    sites,
    activeWorkspaceId: activeWorkspace?.id,
    isPending,
    mutatingId,
    searchTerm,
    setSearchTerm,
    handleDelete: handleDelete, // Se exporta directamente, puede ser undefined
    isCreateDialogOpen,
    setCreateDialogOpen,
    openCreateDialog,
    handleCreate,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Seguridad de Tipos**: ((Implementada)) Se ha eliminado el operador de aserción no nula (`!`) en `handleDelete`. El hook ahora exporta `handleDelete` tal como lo recibe (posiblemente `undefined`), y es responsabilidad del componente consumidor (`sites-client.tsx`) manejar este caso.
 *
 * =====================================================================
 */
