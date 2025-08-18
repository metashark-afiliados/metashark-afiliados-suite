// src/lib/hooks/use-sites-page.ts
/**
 * @file src/lib/hooks/use-sites-page.ts
 * @description Hook Soberano refactorizado. Ahora actúa como un orquestador que
 *              compone hooks atómicos (`useDialogState`, `useSearchSync`,
 *              `useOptimisticResourceManagement`) para construir la lógica
 *              completa de la página "Mis Sitios".
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
"use client";

import { useTranslations } from "next-intl";

import { sites as sitesActions } from "@/lib/actions";
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

  // --- Consumo de Hooks Atómicos ---
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
    createAction: sitesActions.createSiteAction,
    deleteAction: sitesActions.deleteSiteAction,
  });

  // --- Lógica de Negocio Específica de la Entidad ---
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

    genericHandleCreate(formData, optimisticSite);
    closeCreateDialog();
  };

  return {
    sites,
    activeWorkspaceId: activeWorkspace?.id,
    isPending,
    mutatingId,
    searchTerm,
    setSearchTerm,
    handleDelete: handleDelete!,
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
 * 1. **Arquitectura de Composición (LEGO)**: ((Implementada)) El hook ya no contiene lógica monolítica. Ahora compone hooks atómicos y reutilizables, lo que mejora drásticamente su legibilidad, mantenibilidad y adhesión a los principios de diseño de élite.
 * 2. **Principio de Responsabilidad Única (SRP)**: ((Implementada)) La responsabilidad de `useSitesPage` se ha reducido a orquestar otros hooks y contener la lógica de negocio específica de la entidad "sitio", como la construcción del objeto optimista.
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción de Lógica Optimista**: ((Vigente)) La lógica de construcción del `optimisticSite` podría ser abstraída a una función `createOptimisticSite` en un archivo helper (`tests/utils/factories.ts`), haciendo que el `handleCreate` sea aún más conciso y reutilizable en pruebas.
 *
 * =====================================================================
 */
// src/lib/hooks/use-sites-page.ts
