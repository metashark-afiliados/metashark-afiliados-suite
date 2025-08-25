// src/app/[locale]/dashboard/layout.tsx
/**
 * @file layout.tsx
 * @description Orquestador de servidor. Simplificado para solo obtener datos,
 *              proveer contexto y renderizar el nuevo `DashboardLayout` de cliente.
 * @author Raz Podestá
 * @version 12.0.0
 */
import React from "react";
import { redirect } from "next/navigation";

import DashboardLayoutClient from "@/components/layout/DashboardLayout";
import { DashboardContextProviders } from "@/components/layout/DashboardContextProviders";
import { getLayoutData } from "@/components/layout/dashboard.loader";
import { GlobalOverlays } from "@/components/layout/GlobalOverlays";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { logger } from "@/lib/logging";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  logger.trace("[DashboardLayout] Ensamblando layout de élite...");
  const layoutData = await getLayoutData();

  if (!layoutData) {
    return redirect("/auth/login?next=/dashboard");
  }

  return (
    <DashboardContextProviders value={layoutData}>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
      <GlobalOverlays />
    </DashboardContextProviders>
  );
}
