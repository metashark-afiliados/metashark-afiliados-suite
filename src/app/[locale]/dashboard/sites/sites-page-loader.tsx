// src/app/[locale]/dashboard/sites/sites-page-loader.tsx
/**
 * @file src/app/[locale]/dashboard/sites/sites-page-loader.tsx
 * @description Componente de servidor que encapsula la carga de datos. Ha sido
 *              refactorizado a un estándar de élite para consumir la API de datos
 *              atómica, validar los parámetros de la URL con guardianes de tipo,
 *              y manejar errores de forma resiliente.
 * @author L.I.A. Legacy & Raz Podestá
 * @version 4.1.0
 * @date 2025-08-27
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AlertTriangle } from "lucide-react";
import React from "react";

import { ErrorStateCard } from "@/components/shared/error-state-card";
import { createPersistentErrorLog } from "@/lib/actions/_helpers";
// --- INICIO DE CORRECCIÓN ARQUITECTÓNICA (TS2305) ---
import { sites as sitesData } from "@/lib/data";
import { isSiteSortOption, isSiteStatusFilter } from "@/lib/data/sites/types";
// --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";

import { SitesClient } from "./sites-client";

const SITES_PER_PAGE = 9;

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
      `[SitesPageLoader] Usuario ${user.id} sin workspace activo. Redirigiendo a /welcome.`
    );
    return redirect("/welcome");
  }

  const page = Number(searchParams.page) || 1;
  const searchQuery = searchParams.q || "";

  // --- INICIO DE BLINDAJE CON GUARDIANES DE TIPO (TS2724) ---
  const statusFilter = isSiteStatusFilter(searchParams.status)
    ? searchParams.status
    : "all";

  const sortOption = isSiteSortOption(searchParams.sort)
    ? searchParams.sort
    : "created_at_desc";
  // --- FIN DE BLINDAJE CON GUARDIANES DE TIPO ---

  logger.trace("[SitesPageLoader] Cargando datos para la página de sitios.", {
    userId: user.id,
    workspaceId,
    page,
    searchQuery,
    statusFilter,
    sortOption,
  });

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
      { workspaceId, searchParams }
    );

    logger.error(
      `[SitesPageLoader] Fallo crítico al cargar sitios para workspace ${workspaceId}. Error ID: ${errorId}`,
      { error: error instanceof Error ? error.message : String(error) }
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Errores de Módulo (TS2305, TS2724)**: ((Implementada)) Se ha corregido la importación para que consuma desde `@/lib/data` (que exporta el módulo `sites` atomizado) y se han corregido las importaciones de los guardianes de tipo.
 * 2. **Resolución de Error de Propiedad (`TS2339`)**: ((Implementada)) Al consumir la API namespaced `sites.management.getSitesByWorkspaceId`, se resuelve el error de que `management` no existe.
 * 3. **Blindaje de Parámetros de URL**: ((Implementada)) Se utilizan los guardianes de tipo para validar y acotar los `searchParams`, eliminando la necesidad de aserciones de tipo inseguras.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de `page` y `q`**: ((Vigente)) Para una seguridad absoluta, los parámetros `page` y `q` también podrían ser validados con schemas de Zod.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/sites-page-loader.tsx
