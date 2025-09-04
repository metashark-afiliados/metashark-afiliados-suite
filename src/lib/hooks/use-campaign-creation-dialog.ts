// src/lib/hooks/use-campaign-creation-dialog.ts
/**
 * @file use-campaign-creation-dialog.ts
 * @description Hook Soberano que encapsula la lógica de estado y las acciones
 *              para el diálogo de creación de campañas. Refactorizado para
 *              alinearse con el contrato de datos de "Lean Database" y la
 *              Constitución de Observabilidad.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 */
"use client";

import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import { type CampaignMetadata } from "@/lib/data/campaigns";
import { useDialogState } from "@/lib/hooks/ui/useDialogState";
import { clientLogger } from "@/lib/logger";

/**
 * @public
 * @interface UseCampaignCreationDialogProps
 * @description Contrato de props para el hook.
 */
interface UseCampaignCreationDialogProps {
  siteId: string;
  /** Callback del hook `useOptimisticResourceManagement` para manejar la creación. */
  handleCreate: (
    formData: FormData,
    optimisticItem: Omit<CampaignMetadata, "id">
  ) => void;
}

/**
 * @public
 * @function useCampaignCreationDialog
 * @description Orquesta el estado y las acciones para el modal de creación de campañas.
 * @param {UseCampaignCreationDialogProps} props - Las dependencias del hook.
 * @returns Un objeto con el estado y los manejadores para la UI.
 */
export function useCampaignCreationDialog({
  siteId,
  handleCreate,
}: UseCampaignCreationDialogProps) {
  const t = useTranslations("CampaignsPage.toasts");
  const {
    isOpen: isCreateDialogOpen,
    open: openCreateDialog,
    close: closeCreateDialog,
    setIsOpen: setCreateDialogOpen,
  } = useDialogState();

  const handleCreateCampaign = (formData: FormData) => {
    const name = formData.get("name") as string;
    // --- INICIO DE REFACTORIZACIÓN: Firma de Logging Canónica ---
    clientLogger.trace(
      { name, siteId },
      `[useCampaignCreationDialog] Iniciando creación de campaña optimista`
    );
    // --- FIN DE REFACTORIZACIÓN ---

    // --- INICIO DE REFACTORIZACIÓN: Alineación con Contrato de Datos ---
    const optimisticCampaign: Omit<CampaignMetadata, "id"> = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      site_id: siteId,
      status: "draft", // Simula el JOIN de la capa de datos
      status_id: 1, // ID canónico para 'draft'
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      affiliate_url: null,
      creation_id: `optimistic-creation-${Date.now()}`,
    };
    // --- FIN DE REFACTORIZACIÓN ---

    handleCreate(formData, optimisticCampaign);
    toast.success(t("create_success"));
    closeCreateDialog();
  };

  return {
    isCreateDialogOpen,
    openCreateDialog,
    setCreateDialogOpen,
    handleCreateCampaign,
  };
}
// src/lib/hooks/use-campaign-creation-dialog.ts
