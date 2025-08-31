// src/app/[locale]/dashboard/layout.tsx
/**
 * @file layout.tsx
 * @description Orquestador de servidor y guardián de seguridad para el dashboard.
 *              Consume el componente de cliente canónico `DashboardLayoutClient`
 *              desde la SSoT consolidada.
 * @author Raz Podestá - MetaShark Tech
 * @version 14.0.0
 * @date 2025-08-31
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";
import { redirect } from "next/navigation";

import {
  DashboardLayoutData,
  getLayoutData,
} from "@/components/layout/dashboard.loader";
import { DashboardContextProviders } from "@/components/layout/DashboardContextProviders";
import DashboardLayoutClient from "@/components/layout/DashboardLayout"; // <-- IMPORTACIÓN CORREGIDA
import { GlobalOverlays } from "@/components/layout/GlobalOverlays";
import { logger } from "@/lib/logging";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  logger.trace(
    "[DashboardLayout:Server] Iniciando orquestación y obtención de datos."
  );

  const layoutData: DashboardLayoutData | null = await getLayoutData();

  if (!layoutData) {
    logger.warn(
      "[DashboardLayout:Server] Sesión no válida. Redirigiendo a /login."
    );
    return redirect("/login?next=/dashboard");
  }

  logger.info(
    "[DashboardLayout:Server] Datos de sesión válidos. Renderizando layout autenticado."
  );

  return (
    <DashboardContextProviders value={layoutData}>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
      <GlobalOverlays />
    </DashboardContextProviders>
  );
}
// src/app/[locale]/dashboard/layout.tsx
