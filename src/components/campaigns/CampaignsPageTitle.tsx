// src/components/campaigns/CampaignsPageTitle.tsx
/**
 * @file CampaignsPageTitle.tsx
 * @description Aparato de UI atómico y soberano. Su única responsabilidad es
 *              renderizar la sección de título para la página de "Campañas",
 *              incluyendo el enlace de regreso a "Mis Sitios". Consume sus
 *              propias traducciones.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { type SiteWithCampaignCount } from "@/lib/data/sites/types";
import { clientLogger } from "@/lib/logger";
import { Link } from "@/lib/navigation";

export interface CampaignsPageTitleProps {
  site: Pick<SiteWithCampaignCount, "id" | "name" | "subdomain">;
}

export function CampaignsPageTitle({
  site,
}: CampaignsPageTitleProps): React.ReactElement {
  clientLogger.trace(
    "[CampaignsPageTitle] Renderizando componente de título soberano."
  );
  const t = useTranslations("CampaignsPage");

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="-ml-4">
        <Link href="/dashboard/sites">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToSitesButton")}
        </Link>
      </Button>
      <h1 className="text-2xl font-bold">
        {t.rich("pageTitle", {
          siteName: site.subdomain,
          span: (chunks) => <span className="text-primary">{chunks}</span>,
        })}
      </h1>
      <p className="text-muted-foreground">{t("pageDescription")}</p>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato aísla perfectamente la responsabilidad de renderizar el título de la página, desacoplándolo de los controles de acción y adhiriéndose a la "Filosofía LEGO".
 * 2. **Soberanía de I18n**: ((Implementada)) El componente es autocontenido en su consumo de traducciones, mejorando la modularidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Breadcrumbs Dinámicos**: ((Vigente)) El enlace "Back to Sites" podría ser reemplazado por un componente `Breadcrumbs` completo que muestre "Dashboard / Sites / {siteName}", consumiendo el `BreadcrumbsContext` para una navegación más rica.
 *
 * =====================================================================
 */
// src/components/campaigns/CampaignsPageTitle.tsx
