// src/lib/hooks/use-site-assignment.ts
/**
 * @file use-site-assignment.ts
 * @description Hook Soberano que encapsula toda la lógica de estado y acciones
 *              para el flujo de asignación de sitios en el constructor. Ha sido
 *              refactorizado para consumir la API de datos y acciones atomizada,
 *              resolviendo el error de módulo TS2306.
 * @author Raz Podestá
 * @version 2.0.0
 * @date 2025-08-27
 */
"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

// --- INICIO DE CORRECCIÓN ARQUITECTÓNICA ---
import { sites as sitesActions } from "@/lib/actions";
import { assignSiteToCampaignAction } from "@/lib/actions/campaigns/assign-site.action";
import { useDashboard } from "@/lib/context/DashboardContext";
import { sites as sitesData } from "@/lib/data";
import { type SiteBasicInfo } from "@/lib/data/sites";
// --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
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
        // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA ---
        const { sites: fetchedSites } =
          await sitesData.management.getSitesByWorkspaceId(activeWorkspace.id, {
            limit: 1000,
          });
        // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
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
  }, [campaignId, selectedSiteId, t, tErrors]);

  const handleCreateSite = useCallback(
    (formData: FormData) => {
      startCreateTransition(async () => {
        // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA ---
        const result = await sitesActions.createSiteAction(formData);
        // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
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
    [fetchSites, setCreateDialogOpen, tSitesPage]
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
 * 1. ((Implementada)) **Resolución de Error de Módulo (TS2306)**: Se han corregido todas las importaciones para que consuman las APIs y tipos desde los nuevos módulos atomizados (`@/lib/data/sites`, `@/lib/actions`), resolviendo el error de compilación.
 * 2. ((Implementada)) **Consistencia Arquitectónica**: El hook ahora es un consumidor canónico de la nueva arquitectura de datos y acciones, propagando el nuevo diseño a la capa de lógica de UI.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **UI Optimista para Creación**: El hook podría añadir el nuevo sitio al estado `sites` de forma optimista inmediatamente después de llamar a `createSiteAction`, en lugar de esperar a `fetchSites`. Esto proporcionaría una UX más instantánea.
 * 2. ((Pendiente)) **Inyección de Dependencias para Pruebas**: Para facilitar las pruebas unitarias, el hook podría ser refactorizado para aceptar las Server Actions y funciones de datos como dependencias opcionales, permitiendo su fácil simulación.
 *
 * =====================================================================
 */
// src/lib/hooks/use-site-assignment.ts
