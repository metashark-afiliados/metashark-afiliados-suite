// src/app/[locale]/dashboard/dashboard-client.tsx
/**
 * @file dashboard-client.tsx
 * @description Orquestador de UI de cliente para el "Hub Creativo". Simplificado
 *              a un ensamblador 100% puro que compone componentes soberanos.
 * @author Raz Podestá - MetaShark Tech
 * @version 8.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { ActionDock } from "@/components/dashboard/ActionDock";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import { clientLogger } from "@/lib/logging";

export function DashboardClient(): JSX.Element {
  clientLogger.trace("[DashboardClient] Renderizando orquestador de UI puro.");
  return (
    <>
      <WelcomeHero />
      <ActionDock />
      <RecentActivity />
    </>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Simplificación Radical (SRP):** El componente ahora es un ensamblador puro, sin lógica de datos ni i18n, cumpliendo la arquitectura de élite.
 * =====================================================================
 */
// src/app/[locale]/dashboard/dashboard-client.tsx
