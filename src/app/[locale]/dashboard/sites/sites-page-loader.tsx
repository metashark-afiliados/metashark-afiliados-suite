// src/app/[locale]/dashboard/sites/sites-page-loader.tsx
/**
 * @file src/app/[locale]/dashboard/sites/sites-page-loader.tsx
 * @description Componente de servidor que encapsula la carga de datos. Ha sido
 *              refactorizado a un estándar de élite para consumir la API de datos
 *              atómica, validar los parámetros de la URL con guardianes de tipo,
 *              y manejar errores de forma resiliente.
 * @author Raz Podestá - MetaShark Tech & Raz Podestá
 * @version 5.0.0
 */
"use server";
import "server-only";

import { AlertTriangle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import { ErrorStateCard } from "@/components/shared/error-state-card";
import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import { sites as sitesData } from "@/lib/data";
import { isSiteSortOption, isSiteStatusFilter } from "@/lib/data/sites/types";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

import { SitesClient } from "./sites-client";

const SITES_PER_PAGE = 9;

/**
 * @public
 * @async
 * @component SitesPageLoader
 * @description Orquestador de servidor para la página "Mis Sitios". Responsable de:
 *              1. Validar la sesión y el contexto del workspace.
 *              2. Sanear y validar los parámetros de búsqueda de la URL.
 *              3. Obtener los datos paginados de los sitios desde la capa de datos.
 *              4. Manejar errores críticos y mostrar un estado de error resiliente.
 *              5. Pasar los datos obtenidos al componente de cliente `SitesClient`.
 * @param {object} props - Propiedades del componente.
 * @param {{ page?: string; q?: string; status?: string; sort?: string; }} props.searchParams - Parámetros de la URL.
 * @returns {Promise<React.ReactElement>} El componente `SitesClient` hidratado o un `ErrorStateCard`.
 */
export async function SitesPageLoader({
  searchParams,
}: {
  searchParams: {
    page?: string;
    q?: string;
    status?: string;
    sort?: string;
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
      { userId: user.id },
      "[SitesPageLoader] Usuario sin workspace activo. Redirigiendo a /welcome."
    );
    return redirect("/welcome");
  }

  const page = Number(searchParams.page) || 1;
  const searchQuery = searchParams.q || "";
  const statusFilter = isSiteStatusFilter(searchParams.status)
    ? searchParams.status
    : "all";
  const sortOption = isSiteSortOption(searchParams.sort)
    ? searchParams.sort
    : "created_at_desc";

  const context = {
    userId: user.id,
    workspaceId,
    page,
    searchQuery,
    statusFilter,
    sortOption,
  };

  logger.trace(context, "[SitesPageLoader] Cargando datos para la página.");

  try {
    const { sites, totalCount } =
      await sitesData.management.getSitesByWorkspaceId(workspaceId, {
        page,
        limit: SITES_PER_PAGE,
        query: searchQuery,
        status: statusFilter,
        sort: sortOption,
      });

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
    const errorId = await createPersistentErrorLog(
      "SitesPageLoader.critical",
      error as Error,
      context
    );

    logger.error(
      { err: error, errorId, ...context },
      "[SitesPageLoader] Fallo crítico al cargar sitios."
    );
    const t = await getTranslations("SitesPage.errorState");
    return (
      <ErrorStateCard
        icon={AlertTriangle}
        title={t("title")}
        description={t("description", { errorId })}
      />
    );
  }
}
// src/app/[locale]/dashboard/sites/sites-page-loader.tsx
