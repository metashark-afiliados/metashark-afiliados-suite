// src/lib/hooks/use-sites-page.ts
/**
 * @file src/lib/hooks/use-sites-page.ts
 * @description Hook Soberano y Única Fuente de Verdad para la lógica de cliente
 *              de la página de gestión de sitios. Ha sido refactorizado para
 *              alinearse con la arquitectura canónica del proyecto, corrigiendo
 *              su nomenclatura y dependencias de importación.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
"use client";

import { useCallback, useState } from "react";

import { sites as sitesActions } from "@/lib/actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { useOptimisticResourceManagement } from "@/lib/hooks/use-optimistic-resource-management";
import { logger } from "@/lib/logging";
import { usePathname, useRouter } from "@/lib/navigation"; // <-- CORRECCIÓN
import { debounce } from "@/lib/utils";

/**
 * @public
 * @exports useSitesPage
 * @description Hook soberano que encapsula toda la lógica de la página "Mis Sitios".
 * @param {object} params - Parámetros de inicialización.
 * @param {SiteWithCampaignCount[]} params.initialSites - La lista inicial de sitios.
 * @returns Un objeto con todo el estado y los manejadores necesarios para la UI.
 */
export function useSitesPage({
  initialSites,
}: {
  initialSites: SiteWithCampaignCount[];
}) {
  const { activeWorkspace } = useDashboard();
  const router = useRouter();
  const pathname = usePathname();
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const {
    items: sites,
    isPending,
    mutatingId,
    handleCreate: genericHandleCreate,
    handleDelete,
  } = useOptimisticResourceManagement<SiteWithCampaignCount>({
    initialItems: initialSites,
    entityName: "Site",
    createAction: sitesActions.createSiteAction,
    deleteAction: sitesActions.deleteSiteAction,
  });

  const handleSearch = useCallback(
    debounce((query: string) => {
      logger.trace(`[useSitesPage] Búsqueda activada`, { query });
      const params = new URLSearchParams(window.location.search);
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}` as any); // Type assertion is acceptable here
    }, 500),
    [pathname, router]
  );

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
      owner_id: "optimistic-user-placeholder",
      custom_domain: null,
      campaign_count: 0,
    };

    genericHandleCreate(formData, optimisticSite);
    setCreateDialogOpen(false);
  };

  return {
    sites,
    activeWorkspaceId: activeWorkspace?.id,
    isPending,
    mutatingId,
    handleSearch,
    handleCreate,
    handleDelete,
    isCreateDialogOpen,
    setCreateDialogOpen,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación Arquitectónica**: ((Implementada)) Se ha corregido la nomenclatura del archivo y las rutas de importación, alineando el aparato con la SSoT de navegación y la estructura canónica del proyecto.
 *
 * @subsection Melhorias Futuras
 * 1. **Estado de Edición**: ((Vigente)) Para una futura funcionalidad de edición de sitios, este hook podría expandirse para gestionar el estado de un diálogo de edición y la lógica de `handleUpdate`.
 * 2. **Gestión de Ordenamiento**: ((Vigente)) Añadir estado y un manejador `handleSort` para permitir al usuario cambiar el orden de la lista de sitios.
 *
 * =====================================================================
 */
// src/lib/hooks/use-sites-page.ts
