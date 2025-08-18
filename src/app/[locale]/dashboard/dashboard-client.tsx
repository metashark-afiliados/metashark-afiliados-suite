// src/app/[locale]/dashboard/dashboard-client.tsx
/**
 * @file src/app/[locale]/dashboard/dashboard-client.tsx
 * @description Orquestador de UI de élite para el "Hub de Creación Soberano" v12.0.
 *              Actúa como un ensamblador puro, componiendo los aparatos atómicos
 *              `DashboardHeader`, `WelcomeHero`, `ActionDock` y `RecentActivity`
 *              para construir la página principal del dashboard.
 * @author Raz Podestá
 * @version 4.0.0
 */
"use client";

import { useTranslations } from "next-intl";

import { ActionDock } from "@/components/dashboard/ActionDock";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { useDashboard } from "@/lib/context/DashboardContext";
import { logger } from "@/lib/logging";

/**
 * @public
 * @component DashboardClient
 * @description Ensambla la UI interactiva para la página principal del dashboard.
 * @returns {JSX.Element}
 */
export function DashboardClient(): JSX.Element {
  logger.trace(
    "[DashboardClient] Renderizando orquestador de UI del 'Hub de Creación Soberano'."
  );
  const t = useTranslations("DashboardPage");
  const { user, recentCampaigns } = useDashboard();

  const username = user.user_metadata?.full_name || user.email || "User";
  const breadcrumbs = [{ label: t("breadcrumbs.dashboard") }];

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <WelcomeHero
        username={username}
        searchPlaceholder={t("welcomeHero.searchPlaceholder")}
      />
      <ActionDock />
      <RecentActivity recentCampaigns={recentCampaigns} />
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Ensamblaje Puro**: ((Implementada)) Se ha eliminado toda la lógica de estado y manejo de eventos. El componente ahora es un ensamblador puro que compone aparatos atómicos, cumpliendo con la "Filosofía LEGO" al más alto nivel.
 * 2. **Simplificación y Cohesión**: ((Implementada)) La complejidad ha sido drásticamente reducida. La única responsabilidad del componente es la composición, mejorando la legibilidad y la mantenibilidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Renderizado Condicional de Módulos**: ((Vigente)) Este componente podría ser extendido para renderizar condicionalmente sus hijos (`ActionDock`, `RecentActivity`) basado en los permisos o el plan del usuario, consumiendo datos adicionales del `DashboardContext`.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/dashboard-client.tsx
