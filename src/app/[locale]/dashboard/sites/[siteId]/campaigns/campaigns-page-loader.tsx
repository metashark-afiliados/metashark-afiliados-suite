/**
 * @file src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-page-loader.tsx
 * @description Cargador de datos de servidor de élite. Ha sido nivelado para
 *              consumir la capa de datos de campañas a través de su namespace
 *              atómico correcto (`campaignsData.management`), y para consumir
 *              el contrato de tipos enriquecido de `SiteBasicInfo`, resolviendo
 *              todas las desincronizaciones de datos y tipos.
 * @author Raz Podestá
 * @version 2.1.0
 */
import React from "react";

import { requireSitePermission } from "@/lib/auth/user-permissions";
import { campaignsData, workspaces } from "@/lib/data";
import { logger } from "@/lib/logging";

import { CampaignsClient } from "./campaigns-client";

const CAMPAIGNS_PER_PAGE = 10;

/**
 * @public
 * @interface CampaignsPageLoaderProps
 * @description Define el contrato de props para el cargador de datos,
 *              incluyendo parámetros de ruta y de búsqueda.
 */
interface CampaignsPageLoaderProps {
  params: { siteId: string };
  searchParams: {
    page?: string;
    q?: string;
    status?: "draft" | "published" | "archived";
    sortBy?: "updated_at_desc" | "name_asc";
  };
}

/**
 * @public
 * @async
 * @function CampaignsPageLoader
 * @description Orquesta la lógica del lado del servidor para la página de gestión de campañas.
 *              1. Valida los permisos del usuario para el sitio.
 *              2. Obtiene los datos del workspace y del sitio.
 *              3. Obtiene la lista paginada y filtrada de campañas.
 *              4. Ensambla y renderiza el `CampaignsClient` con las props necesarias.
 * @param {CampaignsPageLoaderProps} props - Las propiedades del componente.
 * @returns {Promise<React.ReactElement | null>} El componente de cliente renderizado o null si la autorización falla.
 */
export async function CampaignsPageLoader({
  params,
  searchParams,
}: CampaignsPageLoaderProps): Promise<React.ReactElement | null> {
  const { siteId } = params;
  const { page: pageStr, q, status, sortBy } = searchParams;
  const page = Number(pageStr) || 1;

  const permissionCheck = await requireSitePermission(siteId, [
    "owner",
    "admin",
    "member",
  ]);

  if (!permissionCheck.success) {
    // El guardián se encarga de la redirección.
    return null;
  }

  const { site } = permissionCheck.data;
  const workspace = await workspaces.getWorkspaceById(site.workspace_id);

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
    site: { id: site.id, subdomain: site.subdomain, name: site.name },
    workspace: { name: workspace?.name || "Workspace" },
    initialCampaigns: campaigns,
    totalCount: totalCount,
    page: page,
    limit: CAMPAIGNS_PER_PAGE,
    searchQuery: q || "",
    status: status,
    sortBy: sortBy,
  };

  return <CampaignsClient {...clientProps} />;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación Arquitectónica**: ((Implementada)) La llamada a la capa de datos ahora usa la ruta de namespace completa `campaignsData.management`, resolviendo el error de compilación `TS2339`.
 * 2. **Contexto Enriquecido**: ((Implementada)) El componente ahora obtiene y pasa el nombre del sitio, requerido por el `CampaignsClient` para construir la UI.
 * 3. **Observabilidad**: ((Implementada)) Se ha añadido un `logger.trace` para monitorear la carga de datos.
 *
 * @subsection Melhorias Futuras
 * 1. **Cacheo de Permisos**: ((Vigente)) El `requireSitePermission` sigue siendo un candidato ideal para `React.cache` para optimizar el rendimiento en ciclos de renderizado complejos.
 * 2. **Estado de Error**: ((Vigente)) La obtención de datos podría envolverse en un `try/catch` para pasar un estado de error explícito al `CampaignsClient` en caso de fallo de la base de datos, en lugar de lanzar una excepción.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-page-loader.tsx
