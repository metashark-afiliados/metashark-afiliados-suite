// src/app/[locale]/dashboard/page.tsx
/**
 * @file src/app/[locale]/dashboard/page.tsx
 * @description Punto de entrada del servidor para el dashboard. Este Server Component
 *              orquesta la obtención de datos específicos de la página (campañas
 *              recientes) y los pasa a su componente de cliente. Incluye un `Suspense
 *              boundary` con un esqueleto de carga de alta fidelidad para una UX de élite.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { Suspense } from "react";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { AlertTriangle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { campaigns as campaignsData } from "@/lib/data";
import { logger } from "@/lib/logging";

import { DashboardClient } from "./dashboard-client";

/**
 * @private
 * @component PageSkeleton
 * @description Renderiza un esqueleto de carga de alta fidelidad mientras los datos se cargan.
 * @returns {React.ReactElement}
 */
const PageSkeleton = () => (
  <div className="flex h-full flex-col gap-8 animate-pulse">
    <div className="space-y-1">
      <div className="h-8 w-1/3 rounded-md bg-muted" />
      <div className="h-5 w-1/2 rounded-md bg-muted" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="h-32 rounded-lg bg-muted md:col-span-1" />
      <div className="h-32 rounded-lg bg-muted md:col-span-1" />
      <div className="h-32 rounded-lg bg-muted md:col-span-1" />
    </div>
    <div className="space-y-4">
      <div className="h-6 w-1/4 rounded-md bg-muted" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="h-24 rounded-lg bg-muted" />
        <div className="h-24 rounded-lg bg-muted" />
        <div className="h-24 rounded-lg bg-muted" />
      </div>
    </div>
  </div>
);

/**
 * @private
 * @async
 * @component DashboardPageLoader
 * @description Componente de servidor que maneja la lógica de obtención de datos.
 * @returns {Promise<React.ReactElement>}
 */
async function DashboardPageLoader() {
  const cookieStore = cookies();
  const activeWorkspaceId = cookieStore.get("active_workspace_id")?.value;

  if (!activeWorkspaceId) {
    logger.warn(
      "[DashboardPageLoader] No se encontró workspace activo. No se pueden cargar campañas recientes."
    );
    return <DashboardClient recentCampaigns={[]} />;
  }

  try {
    logger.trace(
      `[DashboardPageLoader] Obteniendo campañas recientes para workspace: ${activeWorkspaceId}`
    );
    const recentCampaigns =
      await campaignsData.getRecentCampaignsByWorkspaceId(activeWorkspaceId);
    return <DashboardClient recentCampaigns={recentCampaigns} />;
  } catch (error) {
    const errorContext =
      error instanceof Error
        ? { message: error.message }
        : { error: String(error) };
    logger.error(
      `[DashboardPageLoader] Fallo al cargar campañas recientes para workspace: ${activeWorkspaceId}`,
      errorContext
    );

    const t = await getTranslations("DashboardPage");
    return (
      <Card className="flex flex-col items-center justify-center h-full p-8 text-center bg-destructive/10 border-destructive/50">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold text-destructive-foreground">
          {t("error_title")}
        </h2>
        <p className="text-muted-foreground mt-2">{t("error_description")}</p>
      </Card>
    );
  }
}

/**
 * @public
 * @async
 * @component DashboardPage
 * @description Punto de entrada principal de la página del dashboard.
 * @returns {Promise<React.ReactElement>}
 */
export default async function DashboardPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DashboardPageLoader />
    </Suspense>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Personalización del Dashboard**: ((Vigente)) La lógica de `DashboardPageLoader` podría expandirse para obtener la configuración de layout del usuario y pasarla al `DashboardClient` para un renderizado personalizado.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error 404**: ((Implementada)) La reconstrucción de este aparato, junto con su layout, resuelve el error 404 en `/dashboard`, restaurando el flujo de usuario principal.
 * 2. **Arquitectura de Carga de Datos**: ((Implementada)) El uso del patrón `Page` -> `Suspense` -> `Loader` es una implementación de élite que desacopla la UI de la obtención de datos y proporciona una experiencia de carga instantánea con esqueletos.
 * 3. **Manejo de Errores Resiliente**: ((Implementada)) La función `DashboardPageLoader` incluye un bloque `try/catch` robusto que renderiza un estado de error internacionalizado si la capa de datos falla, previniendo que la aplicación se rompa.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/page.tsx
