// src/lib/hooks/useSitesPage.ts
/**
 * @file useSitesPage.ts
 * @description Hook orquestador soberano. Ha sido refactorizado holísticamente
 *              para delegar la gestión de filtros y vista al hook atómico
 *              `useSitesHeader`, para alinear su lógica optimista con la
 *              arquitectura "Lean Database" (usando status_id), y para incluir
 *              la funcionalidad de edición en línea.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @see .docs-espejo/lib/hooks/useSitesPage.ts.md
 */
"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";

import {
  createSiteAction,
  deleteSiteAction,
  updateSiteNameAction,
} from "@/lib/actions/sites.actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { type SiteWithCampaignCount } from "@/lib/data/sites/types";
import { useDialogState } from "@/lib/hooks/ui/useDialogState";
import { useSitesPageTranslations } from "@/lib/hooks/i18n/useSitesPageTranslations";
import { clientLogger } from "@/lib/logger";
import { isActionError } from "@/lib/validators";
import { useOptimisticResourceManagement } from "./use-optimistic-resource-management";
import { useSitesHeader, type UseSitesHeaderProps } from "./useSitesHeader";

export interface UseSitesPageProps extends UseSitesHeaderProps {
  initialSites: SiteWithCampaignCount[];
}

/**
 * @public
 * @function useSitesPage
 * @description Orquesta toda la lógica de estado y de negocio para la página "Mis Sitios".
 * @param {UseSitesPageProps} props - Propiedades iniciales para el hook.
 * @returns La API completa para gestionar la UI de la página de sitios.
 */
export function useSitesPage(props: UseSitesPageProps) {
  clientLogger.trace(
    {},
    "[useSitesPage] Hook soberano y orquestador inicializado."
  );
  const { tSitesPage, tErrors } = useSitesPageTranslations();
  const { activeWorkspace, user } = useDashboard();
  const router = useRouter();

  const { onViewChange, ...headerState } = useSitesHeader(props);

  const {
    isOpen: isCreateDialogOpen,
    open: openCreateDialog,
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
      status_id: 1, // 1 = 'draft'
      campaign_count: 0,
    };
  };

  const {
    items: sites,
    isPending,
    mutatingId,
    handleCreate: genericHandleCreate,
    handleDelete: genericHandleDelete,
    updateOptimistic,
  } = useOptimisticResourceManagement<SiteWithCampaignCount>({
    initialItems: props.initialSites,
    createAction: createSiteAction,
    deleteAction: deleteSiteAction,
    createOptimisticItem: createOptimisticSite,
  });

  const handleCreate = async (formData: FormData) => {
    if (!genericHandleCreate) return;
    const result = await genericHandleCreate(formData);
    if (result.success) {
      toast.success(
        tSitesPage("header.createDialogTitle") + " " + tErrors("create_success")
      );
      router.refresh();
    } else {
      const errorMessage = isActionError(result)
        ? tErrors(result.error as any, { defaultValue: result.error })
        : tErrors("generic.error_server_generic");
      toast.error(errorMessage);
    }
    setCreateDialogOpen(false);
  };

  const handleDelete = async (formData: FormData) => {
    if (!genericHandleDelete) return;
    const result = await genericHandleDelete(formData);
    if (result.success && result.data?.messageKey) {
      toast.success(tErrors(result.data.messageKey as any));
      router.refresh();
    } else {
      const errorMessage = isActionError(result)
        ? tErrors(result.error as any, { defaultValue: result.error })
        : tErrors("generic.error_server_generic");
      toast.error(errorMessage);
    }
  };

  const handleUpdateSiteName = useCallback(
    async (siteId: string, newName: string) => {
      clientLogger.info(
        { siteId, newName },
        `[useSitesPage] Actualizando nombre del sitio.`
      );

      const oldName = sites.find((site) => site.id === siteId)?.name || "";
      updateOptimistic(siteId, { name: newName });

      const result = await updateSiteNameAction(siteId, newName);

      if (result.success) {
        toast.success(tSitesPage("card.update_name_success_toast"));
        router.refresh();
      } else {
        const errorMessage = isActionError(result)
          ? tErrors(result.error as any, { defaultValue: result.error })
          : tErrors("generic.error_server_generic");
        toast.error(errorMessage);
        updateOptimistic(siteId, { name: oldName });
      }
    },
    [sites, updateOptimistic, tSitesPage, tErrors, router]
  );

  return {
    sites,
    activeWorkspaceId: activeWorkspace?.id,
    isPending,
    mutatingId,
    ...headerState,
    onViewChange, // <-- API CORREGIDA
    handleDelete,
    isCreateDialogOpen,
    setCreateDialogOpen,
    openCreateDialog,
    handleCreate,
    handleUpdateSiteName,
  };
}
// src/lib/hooks/useSitesPage.ts
