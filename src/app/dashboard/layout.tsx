// src/app/dashboard/layout.tsx
/**
 * @file layout.tsx
 * @description Orquestador de servidor y guardián de seguridad para todo el
 *              ecosistema del dashboard. Su única responsabilidad es obtener
 *              los datos de la sesión a través del `loader`, proveer el
 *              contexto global y ensamblar los componentes de UI del layout de cliente.
 * @author Raz Podestá - MetaShark Tech
 * @version 13.0.0
 * @date 2025-08-30
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { redirect } from "next/navigation";
import React from "react";

import {
  DashboardLayoutData,
  getLayoutData,
} from "@/components/layout/dashboard.loader";
import { DashboardContextProviders } from "@/components/layout/DashboardContextProviders";
import DashboardLayoutClient from "@/components/layout/DashboardLayout";
import { GlobalOverlays } from "@/components/layout/GlobalOverlays";
import { logger } from "@/lib/logger";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  logger.trace(
    "[DashboardLayout:Server] Iniciando orquestación de layout y obtención de datos de sesión."
  );

  const layoutData: DashboardLayoutData | null = await getLayoutData();

  if (!layoutData) {
    logger.warn(
      "[DashboardLayout:Server] Sesión no válida o datos no encontrados. Redirigiendo a /login."
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
// src/app/dashboard/layout.tsx
