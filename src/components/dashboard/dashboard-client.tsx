// src/components/dashboard/dashboard-client.tsx
/**
 * @file src/components/dashboard/dashboard-client.tsx
 * @description Orquestador de UI del Hub Creativo. Sincronizado con la
 *              arquitectura de layout v15.0, eliminando la llamada al
 *              `DashboardHeader` obsoleto.
 * @author Raz Podestá
 * @version 6.0.0
 */
"use client";

import { useTranslations } from "next-intl";

import { ActionDock } from "@/components/dashboard/ActionDock";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import { useDashboard } from "@/lib/context/DashboardContext";
import { logger } from "@/lib/logging";

export function DashboardClient(): JSX.Element {
  logger.trace("[DashboardClient] Renderizando orquestador de UI.");
  const t = useTranslations("app.[locale].dashboard.page");
  const { user, recentCampaigns } = useDashboard();

  const username = user.user_metadata?.full_name || user.email || "User";

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      {/* La llamada a DashboardHeader ha sido eliminada. El Layout se encarga de ello. */}
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
 * 1. **Alineación Arquitectónica**: ((Implementada)) Se ha eliminado la llamada redundante al `DashboardHeader`, resolviendo el error `TS2322` y alineando el componente con la nueva SSoT de layout.
 * 2. **Simplificación (SRP)**: ((Implementada)) El componente ahora se enfoca únicamente en renderizar el contenido principal de la página del dashboard, mejorando su cohesión.
 *
 * @subsection Melhorias Futuras
 * 1. **Renderizado Condicional de Módulos**: ((Vigente)) Este componente podría ser extendido para renderizar condicionalmente sus hijos (`ActionDock`, `RecentActivity`) basado en los permisos o el plan del usuario.
 *
 * =====================================================================
 */
// src/components/dashboard/dashboard-client.tsx
