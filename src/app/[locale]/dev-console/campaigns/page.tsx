// src/app/[locale]/dev-console/campaigns/page.tsx
/**
 * @file page.tsx
 * @description Página del Visor de Campañas en el Dev Console. Actúa como
 *              un Server Component para obtener todos los datos de las campañas
 *              y pasarlos al componente de cliente para su renderizado.
 * @author Raz Podestá
 * @version 1.0.0
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
    const campaigns = await adminData.getAllCampaignsWithSiteInfo();

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
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura Servidor-Cliente**: ((Implementada)) Sigue el patrón de élite donde el Server Component maneja la carga de datos y el Client Component maneja la UI.
 * 2. **Manejo de Errores Robusto**: ((Implementada)) Incluye un bloque `try/catch` que renderiza un `ErrorStateCard` internacionalizado si la capa de datos falla.
 * 3. **Full Observabilidad**: ((Implementada)) Registra errores críticos en el servidor para un diagnóstico rápido.
 *
 * @subsection Melhorias Futuras
 * 1. **Paginación del Lado del Servidor**: ((Vigente)) Para escalar a miles de campañas, la llamada a `adminData.getAllCampaignsWithSiteInfo` debería aceptar parámetros de paginación leídos desde la URL (`searchParams`), y esta página debería pasar la información de paginación al `CampaignViewerTable`.
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/campaigns/page.tsx
