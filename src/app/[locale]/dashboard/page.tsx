/**
 * @file src/app/[locale]/dashboard/page.tsx
 * @description Punto de entrada del servidor para el dashboard. Su lógica de
 *              consumo de datos ahora se resuelve correctamente tras la
 *              eliminación del módulo obsoleto `campaigns.ts`, que causaba
 *              un conflicto de resolución de importaciones.
 * @author Raz Podestá
 * @version 2.2.0
 */
import { Suspense } from "react";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { AlertTriangle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { campaignsData } from "@/lib/data";
import { logger } from "@/lib/logging";

import { DashboardClient } from "./dashboard-client";

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
      await campaignsData.management.getRecentCampaignsByWorkspaceId(
        activeWorkspaceId
      );
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

export default async function DashboardPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DashboardPageLoader />
    </Suspense>
  );
}
