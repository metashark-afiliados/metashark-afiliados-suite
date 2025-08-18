// src/lib/hooks/use-campaign-creation-dialog.ts
/**
 * @file use-campaign-creation-dialog.ts
 * @description Hook Soberano que encapsula la lógica de estado y las acciones
 *              para el diálogo de creación de campañas.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { useDialogState } from "@/lib/hooks/ui/useDialogState";
import { logger } from "@/lib/logging";
import { type CampaignMetadata } from "@/lib/data/campaigns";

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
  const {
    isOpen: isCreateDialogOpen,
    open: openCreateDialog,
    close: closeCreateDialog,
    setIsOpen: setCreateDialogOpen,
  } = useDialogState();

  const handleCreateCampaign = (formData: FormData) => {
    const name = formData.get("name") as string;
    logger.trace(
      `[useCampaignCreationDialog] Iniciando creación de campaña optimista`,
      { name, siteId }
    );

    const optimisticCampaign: Omit<CampaignMetadata, "id"> = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      site_id: siteId,
      status: "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      affiliate_url: null,
    };

    handleCreate(formData, optimisticCampaign);
    closeCreateDialog();
  };

  return {
    isCreateDialogOpen,
    openCreateDialog,
    setCreateDialogOpen,
    handleCreateCampaign,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (Lógica de UI)**: ((Implementada)) Este nuevo aparato aísla completamente la lógica de creación de campañas, haciendo que el componente `CampaignsPageHeader` pueda ser refactorizado a un presentador puro.
 * 2. **Desacoplamiento y Reutilización**: ((Implementada)) Al ser un hook, esta lógica puede ser reutilizada por el `ActionDock` para permitir la creación de campañas desde el dashboard principal.
 * 3. **Full Observabilidad**: ((Implementada)) La acción principal del hook está instrumentada con `logger.trace`.
 *
 * @subsection Melhorias Futuras
 * 1. **Soporte para Creación desde Plantilla**: ((Vigente)) El hook puede ser extendido para manejar un `templateId` opcional, que se pasaría a la `createCampaignAction` para crear una campaña con una estructura predefinida.
 *
 * =====================================================================
 */
// src/lib/hooks/use-campaign-creation-dialog.ts
