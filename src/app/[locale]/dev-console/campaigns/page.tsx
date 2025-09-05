// src/app/[locale]/dev-console/campaigns/page.tsx
/**
 * @file page.tsx
 * @description Página del Visor de Campañas en el Dev Console. Ha sido
 *              refactorizado a un estándar de élite para consumir la API de
 *              datos atomizada y para alinear el logging con la Constitución.
 * @author L.I.A. Legacy
 * @version 3.0.0
 * @see .docs-espejo/app/[locale]/dev-console/campaigns/page.tsx.md
 */
import { AlertTriangle } from "lucide-react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { ErrorStateCard } from "@/components/shared/error-state-card";
import { admin as adminData } from "@/lib/data";
import { logger } from "@/lib/logger";
import { CampaignViewerTable } from "../components/CampaignViewerTable";

export default async function CampaignsViewerPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("app.dev-console.CampaignsTable");

  try {
    const campaigns = await adminData.campaigns.getAllCampaignsWithSiteInfo();

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
      { err: error as Error },
      "[DevConsole:CampaignsPage] Error al cargar la lista de campañas."
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
// src/app/[locale]/dev-console/campaigns/page.tsx
