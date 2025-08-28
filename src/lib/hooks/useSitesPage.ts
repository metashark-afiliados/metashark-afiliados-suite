// src/lib/hooks/useSitesPage.ts
/**
 * @file useSitesPage.ts
 * @description Hook orquestador soberano. Ha sido refactorizado holísticamente
 *              para delegar la gestión de filtros y vista al hook atómico
 *              `useSitesHeader` y para alinear explícitamente el contrato de
 *              props (`onViewChange`), resolviendo el error de tipo TS2741.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  createSiteAction,
  deleteSiteAction,
} from "@/lib/actions/sites.actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { type SiteWithCampaignCount } from "@/lib/data/sites/types";
import { useDialogState } from "@/lib/hooks/ui/useDialogState";
import { clientLogger } from "@/lib/logging";
import { useOptimisticResourceManagement } from "./use-optimistic-resource-management";
import { useSitesHeader, type UseSitesHeaderProps } from "./useSitesHeader";

export interface UseSitesPageProps extends UseSitesHeaderProps {
  initialSites: SiteWithCampaignCount[];
}

/**
 * @public
 * @function useSitesPage
 * @description Orquesta la lógica de negocio para la página "Mis Sitios",
 *              componiendo hooks atómicos para filtros, UI optimista y diálogos.
 * @param {UseSitesPageProps} props - Propiedades iniciales para el hook.
 * @returns La API completa para gestionar la UI de la página de sitios.
 */
export function useSitesPage(props: UseSitesPageProps) {
  clientLogger.trace("[useSitesPage] Hook soberano inicializado.");
  const t = useTranslations("SitesPage");
  const { activeWorkspace, user } = useDashboard();
  const router = useRouter();

  const { setViewMode, ...headerState } = useSitesHeader(props);

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
    initialItems: props.initialSites,
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

  return {
    sites,
    activeWorkspaceId: activeWorkspace?.id,
    isPending,
    mutatingId,
    ...headerState,
    onViewChange: setViewMode, // <-- ALINEACIÓN DE CONTRATO DE API
    handleDelete,
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
 * @subsection Melhorias Futuras
 * 1. **Factoría de Items Optimistas Atómica**: ((Vigente)) La lógica de `createOptimisticSite` es específica de esta entidad. Para una reutilización máxima, podría ser extraída a un archivo de factorías (`/lib/factories/optimistic-items.ts`).
 * 2. **Gestión de Estado de Diálogo en Hook Soberano**: ((Vigente)) La lógica del diálogo de creación (`useDialogState`) podría ser abstraída a un hook más pequeño y específico, `useSiteCreationDialog`, para una mayor cohesión y reutilización, siguiendo el patrón de `useCampaignCreationDialog`.
 *
 * =====================================================================
 */
// src/lib/hooks/useSitesPage.ts
