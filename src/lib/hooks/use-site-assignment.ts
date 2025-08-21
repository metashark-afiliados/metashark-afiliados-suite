// src/lib/hooks/use-site-assignment.ts
/**
 * @file use-site-assignment.ts
 * @description Hook Soberano que encapsula toda la lógica de estado y acciones
 *              para el flujo de asignación de sitios en el constructor.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { sites as sitesActions } from "@/lib/actions";
import { assignSiteToCampaignAction } from "@/lib/actions/campaigns/assign-site.action";
import { useDashboard } from "@/lib/context/DashboardContext";
import { type SiteBasicInfo, getSitesByWorkspaceId } from "@/lib/data/sites";
import { logger } from "@/lib/logging";

import { useDialogState } from "./ui/useDialogState";

/**
 * @public
 * @function useSiteAssignment
 * @description Orquesta el estado y las acciones para el flujo de asignación de sitios.
 * @param {string} campaignId - El ID de la campaña a asignar.
 * @returns Un objeto con el estado y los manejadores para la UI.
 */
export function useSiteAssignment(campaignId: string) {
  const t = useTranslations("SiteAssignmentControl");
  const tErrors = useTranslations("CampaignsPage.errors");
  const tSitesPage = useTranslations("SitesPage");
  const { activeWorkspace } = useDashboard();

  const [sites, setSites] = useState<SiteBasicInfo[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [isAssigning, startAssignTransition] = useTransition();
  const [isCreating, startCreateTransition] = useTransition();
  const [isLoadingSites, setIsLoadingSites] = useState(true);
  const {
    isOpen: isCreateDialogOpen,
    open: openCreateDialog,
    setIsOpen: setCreateDialogOpen,
  } = useDialogState();

  const isPending = isAssigning || isCreating;

  const fetchSites = useCallback(async () => {
    if (activeWorkspace) {
      setIsLoadingSites(true);
      try {
        const { sites: fetchedSites } = await getSitesByWorkspaceId(
          activeWorkspace.id,
          { limit: 1000 }
        );
        setSites(fetchedSites);
      } catch (err) {
        logger.error(
          "[useSiteAssignment] Fallo al obtener la lista de sitios",
          err
        );
        toast.error(t("toast_load_sites_error"));
      } finally {
        setIsLoadingSites(false);
      }
    }
  }, [activeWorkspace, t]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const handleAssignSite = useCallback(() => {
    if (!selectedSiteId) {
      toast.error(t("toast_select_site_error"));
      return;
    }
    startAssignTransition(async () => {
      const result = await assignSiteToCampaignAction(
        campaignId,
        selectedSiteId
      );
      if (result.success) {
        toast.success(t("toast_assign_success"));
      } else {
        toast.error(tErrors(result.error as any) || t("toast_assign_error"));
      }
    });
  }, [campaignId, selectedSiteId, t, tErrors, startAssignTransition]);

  const handleCreateSite = useCallback(
    (formData: FormData) => {
      startCreateTransition(async () => {
        const result = await sitesActions.createSiteAction(formData);
        if (result.success) {
          toast.success(tSitesPage("header.createDialogTitle"));
          setCreateDialogOpen(false);
          await fetchSites();
          setSelectedSiteId(result.data.id);
        } else {
          toast.error(result.error);
        }
      });
    },
    [fetchSites, setCreateDialogOpen, tSitesPage, startCreateTransition]
  );

  return {
    sites,
    selectedSiteId,
    setSelectedSiteId,
    isLoadingSites,
    isAssigning,
    isCreating,
    isPending,
    handleAssignSite,
    isCreateDialogOpen,
    openCreateDialog,
    setCreateDialogOpen,
    handleCreateSite,
    activeWorkspace,
    texts: {
      t,
      tSitesPage,
    },
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (Lógica de UI)**: ((Implementada)) Este nuevo aparato aísla completamente la lógica del flujo de asignación, convirtiendo al componente `SiteAssignmentControl` en un orquestador puro.
 *
 * @subsection Melhorias Futuras
 * 1. **Optimistic UI para Creación**: ((Vigente)) El hook podría añadir el nuevo sitio al estado `sites` de forma optimista, en lugar de esperar a `fetchSites`.
 *
 * =====================================================================
 */
// src/lib/hooks/use-site-assignment.ts
