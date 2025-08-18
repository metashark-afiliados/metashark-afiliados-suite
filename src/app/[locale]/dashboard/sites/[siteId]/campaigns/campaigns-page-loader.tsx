// src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-page-loader.tsx
/**
 * @file src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-page-loader.tsx
 * @description Cargador de datos de servidor resiliente y de élite. Ha sido
 *              blindado con manejo de errores `try/catch`, registro persistente
 *              de errores y se ha corregido su ruta de importación de permisos.
 * @author Raz Podestá
 * @version 3.1.0
 */
import React from "react";
import { getTranslations } from "next-intl/server";
import { AlertTriangle } from "lucide-react";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import { ErrorStateCard } from "@/components/shared/error-state-card";
import { campaignsData } from "@/lib/data";
import { requireSitePermission } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logging";

import { CampaignsClient } from "./campaigns-client";

const CAMPAIGNS_PER_PAGE = 10;

interface CampaignsPageLoaderProps {
  params: { siteId: string };
  searchParams: {
    page?: string;
    q?: string;
    status?: "draft" | "published" | "archived";
    sortBy?: "updated_at_desc" | "name_asc";
  };
}

export async function CampaignsPageLoader({
  params,
  searchParams,
}: CampaignsPageLoaderProps): Promise<React.ReactElement> {
  const { siteId } = params;
  const { page: pageStr, q, status, sortBy } = searchParams;
  const page = Number(pageStr) || 1;
  const tError = await getTranslations("CampaignsPage.errors");

  try {
    const permissionCheck = await requireSitePermission(siteId, [
      "owner",
      "admin",
      "member",
    ]);

    if (!permissionCheck.success) {
      return (
        <ErrorStateCard
          icon={AlertTriangle}
          title={tError("permission_denied_title")}
          description={tError("permission_denied_desc")}
        />
      );
    }

    const { site } = permissionCheck.data;

    logger.trace(
      `[CampaignsLoader] Cargando campañas para el sitio ${siteId}, página ${page}`
    );

    const { campaigns, totalCount } =
      await campaignsData.management.getCampaignsMetadataBySiteId(siteId, {
        page,
        limit: CAMPAIGNS_PER_PAGE,
        query: q,
        status,
        sortBy,
      });

    const clientProps = {
      site: { id: site.id, name: site.name, subdomain: site.subdomain },
      initialCampaigns: campaigns,
      totalCount,
      page,
      limit: CAMPAIGNS_PER_PAGE,
      searchQuery: q || "",
      status,
      sortBy,
    };

    return <CampaignsClient {...clientProps} />;
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "CampaignsPageLoader",
      error as Error,
      { siteId, searchParams }
    );
    return (
      <ErrorStateCard
        icon={AlertTriangle}
        title={tError("unexpected_title")}
        description={tError("unexpected_desc", { errorId })}
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
 * 1. **Correção de Integridade de Módulo**: ((Implementada)) Corrigida a rota de importação para `requireSitePermission`, resolvendo um erro crítico de compilação.
 * 2. **Arquitectura Resiliente**: ((Vigente)) Toda la lógica está envuelta en `try/catch`. Cualquier fallo en la capa de datos o permisos será capturado.
 * 3. **Observabilidad Persistente**: ((Vigente)) Los errores capturados se registran en la base de datos a través de `createPersistentErrorLog`.
 * 4. **Feedback de Usuario de Élite**: ((Vigente)) En caso de error, se renderiza un `ErrorStateCard` con un mensaje internacionalizado y un ID de error para el soporte.
 *
 * @subsection Melhorias Futuras
 * 1. **Logging Granular de Falha de Permissão**: ((Vigente)) No bloco `if (!permissionCheck.success)`, registrar explicitamente o `userId` e o `siteId` para uma auditoria de segurança mais detalhada.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-page-loader.tsx
