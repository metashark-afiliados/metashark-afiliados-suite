// src/lib/hooks/useCampaignsClient.ts
/**
 * @file useCampaignsClient.ts
 * @description Hook soberano y orquestador de lógica de élite. Ha sido
 *              refactorizado para alinear su lógica de manejo de filtros
 *              con el contrato de tipo estricto de `CampaignStatusFilter`,
 *              resolviendo el error de tipo TS2345.
 * @author L.I.A. Legacy
 * @version 2.0.0
 * @see .docs-espejo/lib/hooks/useCampaignsClient.ts.md
 */
"use client";

import { useFormatter, useTranslations } from "next-intl";
import React from "react";

import { getCampaignsColumns } from "@/components/campaigns";
import { type CampaignStatusFilter } from "@/lib/data/campaigns";
import { clientLogger } from "@/lib/logger";
import {
  useCampaignsPage,
  type UseCampaignsPageProps,
} from "./use-campaigns-page";

/**
 * @public
 * @function useCampaignsClient
 * @description Orquesta los hooks de estado, acciones y traducciones para la UI de la
 *              página de campañas. Devuelve un objeto con todo lo necesario para que el
 *              componente de presentación renderice la vista.
 * @param {UseCampaignsPageProps} props - Propiedades iniciales para el estado de la página.
 * @returns Un objeto con el estado computado, los manejadores de eventos y las funciones de traducción.
 */
export function useCampaignsClient(props: UseCampaignsPageProps) {
  clientLogger.trace("[useCampaignsClient] Inicializando hook soberano de UI.");

  const t = useTranslations("CampaignsPage");
  const tDialogs = useTranslations("Dialogs");
  const format = useFormatter();

  const pageState = useCampaignsPage(props);

  const handleStatusChange = (newStatus: CampaignStatusFilter) => {
    // La lógica ternaria anterior que pasaba `undefined` era incorrecta.
    // El contrato `CampaignStatusFilter` espera explícitamente "all".
    pageState.setStatusFilter(newStatus);
  };

  const columns = React.useMemo(
    () =>
      getCampaignsColumns({
        t,
        tDialogs,
        format,
        handleDelete: pageState.handleDelete!,
        handleArchive: pageState.handleArchiveCampaign,
        handleDuplicate: pageState.handleDuplicateCampaign,
        isPending: pageState.isPending,
        mutatingId: pageState.mutatingId,
        toastTexts: {
          duplicating: t("toasts.duplicating"),
          archiving: t("toasts.archiving"),
        },
      }),
    [
      t,
      tDialogs,
      format,
      pageState.handleDelete,
      pageState.handleArchiveCampaign,
      pageState.handleDuplicateCampaign,
      pageState.isPending,
      pageState.mutatingId,
    ]
  );

  return {
    ...pageState,
    t,
    columns,
    handleStatusChange,
  };
}
// src/lib/hooks/useCampaignsClient.ts
