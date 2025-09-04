// src/lib/hooks/use-site-assignment.ts
/**
 * @file use-site-assignment.ts
 * @description Hook Soberano para el flujo de asignación de sitios. Simplificado
 *              para adherirse estrictamente al SRP.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

import { sites as sitesActions } from "@/lib/actions";
import { assignSiteToCampaignAction } from "@/lib/actions/campaigns/assign-site.action";
import { useDashboard } from "@/lib/context/DashboardContext";
import { sites as sitesData } from "@/lib/data";
import { type SiteBasicInfo } from "@/lib/data/sites";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { useDialogState } from "./ui/useDialogState";

export function useSiteAssignment(campaignId: string) {
  const t = useTypedTranslations("components.builder.SiteAssignmentControl");
  const tErrors = useTypedTranslations("shared.ValidationErrors");
  const tSitesPage = useTypedTranslations("components.sites.SitesHeader");
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
        const { sites: fetchedSites } =
          await sitesData.management.getSitesByWorkspaceId(activeWorkspace.id, {
            limit: 1000,
          });
        setSites(fetchedSites);
      } catch (err) {
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
  }, [campaignId, selectedSiteId, t, tErrors]);

  const handleCreateSite = useCallback(
    (formData: FormData) => {
      startCreateTransition(async () => {
        const result = await sitesActions.createSiteAction(formData);
        if (result.success) {
          toast.success(tSitesPage("createDialogTitle"));
          setCreateDialogOpen(false);
          await fetchSites();
          setSelectedSiteId(result.data.id);
        } else {
          toast.error(tErrors(result.error as any));
        }
      });
    },
    [fetchSites, setCreateDialogOpen, tSitesPage, tErrors]
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
    t,
  };
}
// src/lib/hooks/use-site-assignment.ts
