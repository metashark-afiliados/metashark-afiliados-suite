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
}): Promise<React.ReactElement> {
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

  logger.trace("[SitesPageLoader] Cargando datos para la página de sitios.", {
    userId: user.id,
    workspaceId,
  });

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
 * @subsection Melhorias Adicionadas
 * 1. **Full Observabilidad**: ((Implementada)) Se ha añadido `logger.trace` para monitorear el inicio de la carga de datos. La observabilidad de errores ya era de élite.
 * 2. **Documentación TSDoc de Élite**: ((Implementada)) Se ha añadido documentación verbosa al componente para formalizar su rol.
 * 3. **Capa de Lógica de Servidor**: ((Vigente)) Este aparato ya aísla perfectamente toda la lógica del lado del servidor, como la lectura de cookies y la obtención de datos, manteniendo los componentes de página y de cliente puros.
 * 4. **Seguridad y Resiliencia**: ((Vigente)) Ya incluye guardias de seguridad robustos y un manejo de errores que muestra una UI de fallback.
 *
 * @subsection Melhorias Futuras
 * 1. **Filtros Avanzados**: ((Vigente)) La llamada a `getSitesByWorkspaceId` podría ser extendida para aceptar más `searchParams`, como un parámetro de ordenamiento (`sortBy=name_asc`), para permitir al usuario ordenar la cuadrícula de sitios.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/sites-page-loader.tsx