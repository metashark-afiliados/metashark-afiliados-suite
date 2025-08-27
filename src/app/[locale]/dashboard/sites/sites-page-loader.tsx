// src/app/[locale]/dashboard/sites/sites-page-loader.tsx
/**
 * @file src/app/[locale]/dashboard/sites/sites-page-loader.tsx
 * @description Componente de servidor que encapsula la carga de datos. Ha sido
 *              refactorizado a un estándar de élite para leer los nuevos
 *              parámetros de filtro (`status`, `sort`) de la URL y pasarlos
 *              tanto a la capa de datos como al estado inicial del cliente,
 *              haciendo que la URL sea la SSoT para el estado de la vista.
 * @author L.I.A. Legacy & Raz Podestá
 * @version 2.0.0
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AlertTriangle } from "lucide-react";
import React from "react";

import { ErrorStateCard } from "@/components/shared/error-state-card";
import {
  sites as sitesData,
  type SiteSortOption,
  type SiteStatusFilter,
} from "@/lib/data/sites";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";

import { SitesClient } from "./sites-client";

const SITES_PER_PAGE = 9;

/**
 * @public
 * @async
 * @function SitesPageLoader
 * @description Obtiene la sesión, el workspace activo, y los datos paginados
 *              y filtrados de los sitios. Maneja los casos de error y pasa las
 *              props al `SitesClient`.
 * @param {object} props
 * @param {{ page?: string; q?: string; status?: SiteStatusFilter; sort?: SiteSortOption }} props.searchParams
 * @returns {Promise<React.ReactElement>}
 */
export async function SitesPageLoader({
  searchParams,
}: {
  searchParams: {
    page?: string;
    q?: string;
    status?: SiteStatusFilter;
    sort?: SiteSortOption;
  };
}): Promise<React.ReactElement> {
  const cookieStore = cookies();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login?next=/dashboard/sites");
  }

  const workspaceId = cookieStore.get("active_workspace_id")?.value;
  if (!workspaceId) {
    logger.warn(
      `[SitesPageLoader] Usuario ${user.id} sin workspace activo. Redirigiendo a /welcome.`
    );
    return redirect("/welcome");
  }

  const page = Number(searchParams.page) || 1;
  const searchQuery = searchParams.q || "";
  const statusFilter = searchParams.status || "all";
  const sortOption = searchParams.sort || "created_at_desc";

  logger.trace("[SitesPageLoader] Cargando datos para la página de sitios.", {
    userId: user.id,
    workspaceId,
    page,
    searchQuery,
    statusFilter,
    sortOption,
  });

  try {
    const { sites, totalCount } = await sitesData.getSitesByWorkspaceId(
      workspaceId,
      {
        page,
        limit: SITES_PER_PAGE,
        query: searchQuery,
        status: statusFilter,
        sort: sortOption,
      }
    );
    return (
      <SitesClient
        initialSites={sites}
        totalCount={totalCount}
        page={page}
        limit={SITES_PER_PAGE}
        initialSearchQuery={searchQuery}
        initialStatusFilter={statusFilter}
        initialSortOption={sortOption}
      />
    );
  } catch (error) {
    logger.error(
      `[SitesPageLoader] Fallo crítico al cargar sitios para workspace ${workspaceId}.`,
      { error: error instanceof Error ? error.message : String(error) }
    );
    const t = await getTranslations("SitesPage.errorState");
    return (
      <ErrorStateCard
        icon={AlertTriangle}
        title={t("title")}
        description={t("description")}
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
 * 1. **Persistencia de Filtros (Server-Side)**: ((Implementada)) El cargador ahora lee `status` y `sort` de los `searchParams`. Esto hace que la URL sea la SSoT. Si un usuario comparte una URL con filtros, el servidor ahora obtendrá y renderizará los datos correctos en la carga inicial.
 * 2. **Sincronización de Estado Inicial**: ((Implementada)) Pasa los filtros leídos de la URL como estado inicial al `SitesClient`, asegurando que la UI del cliente se hidrate en un estado consistente con los datos del servidor.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Parámetros de URL**: ((Vigente)) Los valores de `status` y `sort` se están pasando directamente a la capa de datos. Para una seguridad de élite, se deberían validar contra los tipos `SiteStatusFilter` y `SiteSortOption` aquí en el cargador, usando un valor por defecto si son inválidos, para prevenir inyecciones de parámetros maliciosos. Propondré esta mejora de seguridad en una futura épica de blindaje.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/sites-page-loader.tsx
