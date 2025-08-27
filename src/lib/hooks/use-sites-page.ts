// src/lib/hooks/use-sites-page.ts
/**
 * @file use-sites-page.ts
 * @description Hook orquestador soberano. Enriquecido para gestionar el estado
 *              de la vista dual (`viewMode`) y persistir la preferencia del
 *              usuario en `localStorage`.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-26
 */
"use client";

import { useTranslations } from "next-intl";

import {
  createSiteAction,
  deleteSiteAction,
} from "@/lib/actions/sites.actions";
import { type SiteWithCampaignCount, type ViewMode } from "@/lib/data/sites";
import { useOptimisticResourceManagement } from "@/lib/hooks/use-optimistic-resource-management";
import { useDialogState } from "@/lib/hooks/ui/useDialogState";
import { useSearchSync } from "@/lib/hooks/ui/useSearchSync";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { clientLogger } from "@/lib/logging";
import { useDashboard } from "@/lib/context/DashboardContext";

export function useSitesPage({
  initialSites,
  initialSearchQuery,
}: {
  initialSites: SiteWithCampaignCount[];
  initialSearchQuery: string;
}) {
  clientLogger.trace("[useSitesPage] Hook soberano inicializado.");
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

  // --- INICIO DE MEJORA: GESTIÓN DE VISTA DUAL ---
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    "sites-view-mode",
    "grid"
  );
  // --- FIN DE MEJORA ---

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
 * 1. ((Implementada)) **Gestión de Estado de Vista Dual:** El hook ahora gestiona el estado `viewMode`, proporcionando la lógica necesaria para que el orquestador de cliente renderice la vista correcta.
 * 2. ((Implementada)) **Persistencia de Preferencia de Usuario:** Al utilizar `useLocalStorage`, la preferencia de vista del usuario se recuerda entre sesiones, una característica de UX de élite.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Gestión de Ordenamiento:** Añadir un nuevo estado `sortBy` y un `setSortBy` que también se sincronicen con la URL y se pasen a la capa de datos para permitir el ordenamiento de los sitios.
 *
 * =====================================================================
 */
// src/lib/hooks/use-sites-page.ts
