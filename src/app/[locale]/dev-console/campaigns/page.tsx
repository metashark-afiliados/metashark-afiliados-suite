// src/app/[locale]/dev-console/campaigns/page.tsx
/**
 * @file page.tsx
 * @description Página del Visor de Campañas en el Dev Console. Ha sido
 *              refactorizado a un estándar de élite para consumir la nueva API
 *              de datos atomizada, resolviendo el error de compilación TS2339.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { AlertTriangle } from "lucide-react";

import { admin as adminData } from "@/lib/data";
import { logger } from "@/lib/logging";
import { ErrorStateCard } from "@/components/shared/error-state-card";
import { CampaignViewerTable } from "../components/CampaignViewerTable";

export default async function CampaignsViewerPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("app.dev-console.CampaignsTable");

  try {
    // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA (TS2339) ---
    // Se consume la función desde el módulo atomizado y namespaced,
    // alineando el componente con la nueva SSoT de la capa de datos.
    const campaigns = await adminData.campaigns.getAllCampaignsWithSiteInfo();
    // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <CampaignViewerTable campaigns={campaigns} />
      </div>
    );
  } catch (error) {
    logger.error(
      "[DevConsole:CampaignsPage] Error al cargar la lista de campañas:",
      error instanceof Error ? error.message : String(error)
    );
    return (
      <ErrorStateCard
        icon={AlertTriangle}
        title={t("error_title")}
        description={t("error_description")}
      />
    );
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Paginación del Lado del Servidor**: ((Vigente)) Para escalar a miles de campañas, la llamada a `getAllCampaignsWithSiteInfo` debería aceptar parámetros de paginación leídos desde la URL (`searchParams`), y esta página debería pasar la información de paginación al `CampaignViewerTable`.
 * 2. **Abstracción a `PaginatedResourceView`**: ((Vigente)) Una vez implementada la paginación, este componente podría ser refactorizado para utilizar la abstracción `PaginatedResourceView`, siguiendo el mismo patrón de élite que `sites-client.tsx`, para una máxima reutilización de código y consistencia de UI.
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/campaigns/page.tsx
