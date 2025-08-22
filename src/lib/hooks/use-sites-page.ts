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
 * @description Hook orquestador soberano que encapsula toda la lógica de estado y
 *              acciones para la página "Mis Sitios". Delega la construcción
 *              de textos y JSX a la capa de presentación.
 * @param {{ initialSites: SiteWithCampaignCount[], initialSearchQuery: string }} params
 * @returns Un objeto con todo el estado y los manejadores necesarios para la UI.
 * @version 4.1.0
 * @author Raz Podestá
 */
export function useSitesPage({
  initialSites,
  initialSearchQuery,
}: {
  initialSites: SiteWithCampaignCount[];
  initialSearchQuery: string;
}) {
  logger.trace("[useSitesPage] Hook soberano inicializado.");
  const t = useTranslations("SitesPage");
  const tDialogs = useTranslations("Dialogs");
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
    handleDelete,
    isCreateDialogOpen,
    setCreateDialogOpen,
    openCreateDialog,
    handleCreate,
    t, // Devuelve las funciones de traducción
    tDialogs, // Devuelve las funciones de traducción
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error Crítico (TS2552)**: ((Implementada)) Se ha eliminado la construcción de objetos de texto con JSX del hook, resolviendo la causa raíz del error de compilación.
 * 2. **Restauración de SRP**: ((Implementada)) El hook ahora se enfoca exclusivamente en la lógica de estado y de negocio, dejando la construcción de la UI (incluyendo textos con formato) al componente de presentación, lo cual es una arquitectura más limpia.
 *
 * =====================================================================
 */
// src/lib/hooks/use-sites-page.ts
