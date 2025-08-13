// src/app/[locale]/dashboard/sites/sites-page-loader.tsx
/**
 * @file src/app/[locale]/dashboard/sites/sites-page-loader.tsx
 * @description Componente de servidor aislado que encapsula toda la lógica de
 *              carga de datos y manejo de estados para la página "Mis Sitios".
 *              Actúa como la capa de seguridad y obtención de datos, pasando la
 *              información necesaria al componente `SitesClient` para su renderizado.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AlertTriangle } from "lucide-react";

import { ErrorStateCard } from "@/components/shared/error-state-card";
import { sites as sitesData } from "@/lib/data";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";

import { SitesClient } from "./sites-client";

const SITES_PER_PAGE = 9;

/**
 * @public
 * @async
 * @function SitesPageLoader
 * @description Obtiene la sesión, el workspace activo, y los datos paginados de
 *              los sitios. Maneja los casos de error y pasa las props al `SitesClient`.
 * @param {object} props
 * @param {{ page?: string; q?: string }} props.searchParams - Los parámetros de búsqueda de la URL.
 * @returns {Promise<React.ReactElement>} El componente `SitesClient` con datos o un `ErrorStateCard`.
 */
export async function SitesPageLoader({
  searchParams,
}: {
  searchParams: { page?: string; q?: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/auth/login?next=/dashboard/sites");
  }

  const workspaceId = cookieStore.get("active_workspace_id")?.value;
  if (!workspaceId) {
    logger.warn(
      `[SitesPageLoader] Usuario ${user.id} sin workspace activo. Redirigiendo a /welcome.`
    );
    return redirect("/welcome");
  }

  try {
    const page = Number(searchParams.page) || 1;
    const searchQuery = searchParams.q || "";
    const { sites, totalCount } = await sitesData.getSitesByWorkspaceId(
      workspaceId,
      { page, limit: SITES_PER_PAGE, query: searchQuery }
    );
    return (
      <SitesClient
        initialSites={sites}
        totalCount={totalCount}
        page={page}
        limit={SITES_PER_PAGE}
        searchQuery={searchQuery}
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
 * @subsection Melhorias Futuras
 * 1. **Modo de Desarrollo**: ((Vigente)) Se podría añadir una lógica condicional que, si `process.env.DEV_MODE_ENABLED === 'true'`, devuelva datos simulados (`mockSites`) en lugar de consultar la base de datos, para un desarrollo de UI más rápido y aislado.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Capa de Lógica de Servidor**: ((Implementada)) Este aparato aísla toda la lógica del lado del servidor, como la lectura de cookies y la obtención de datos, manteniendo los componentes de página y de cliente puros.
 * 2. **Seguridad y Resiliencia**: ((Implementada)) Incluye guardias de seguridad para usuarios no autenticados o sin workspace activo, y un manejo de errores robusto que muestra una UI de fallback en caso de fallo de la base de datos.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/sites-page-loader.tsx
