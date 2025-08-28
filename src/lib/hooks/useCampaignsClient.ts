// src/lib/hooks/useCampaignsClient.ts
/**
 * @file useCampaignsClient.ts
 * @description Hook soberano y orquestador de lógica de élite. Encapsula todo el
 *              estado y la lógica de negocio para la página de gestión de campañas,
 *              actuando como el "cerebro" para su componente de presentación puro.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useFormatter, useTranslations } from "next-intl";

import { getCampaignsColumns } from "@/components/campaigns";
import { type CampaignMetadata } from "@/lib/data/campaigns";
import { type SiteWithCampaignCount } from "@/lib/data/sites/types";
import { clientLogger } from "@/lib/logging";
import {
  useCampaignsPage,
  type UseCampaignsPageProps,
} from "./use-campaigns-page";

type CampaignStatus = "draft" | "published" | "archived";

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

  const handleStatusChange = (newStatus: CampaignStatus | "all") => {
    pageState.setStatusFilter(newStatus === "all" ? undefined : newStatus);
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @subsection Melhorias Futuras
 * 1. **Factoría de Columnas Memoizada**: ((Vigente)) La creación de `columns` está dentro de un `useMemo`, pero el objeto `toastTexts` se crea en cada render. Para una optimización de élite, este objeto también podría ser memoizado, o las claves podrían pasarse directamente a `getCampaignsColumns` para que el componente de definición de columnas consuma las traducciones.
 * 2. **Contexto de Página de Campañas**: ((Vigente)) Para desacoplar completamente los componentes hijos (`CampaignsPageHeader`, `PaginatedDataTable`), el valor de retorno de este hook podría ser proporcionado a través de un `CampaignsPageContext`. Esto eliminaría la necesidad de pasar un gran número de props ("prop drilling") a través del componente `CampaignsClient`.
 *
 * =====================================================================
 */
// src/lib/hooks/useCampaignsClient.ts
