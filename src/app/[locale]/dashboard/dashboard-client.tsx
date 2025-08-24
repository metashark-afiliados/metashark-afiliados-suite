// src/app/[locale]/dashboard/dashboard-client.tsx
/**
 * @file src/app/[locale]/dashboard/dashboard-client.tsx
 * @description Orquestador de UI del Hub Creativo. Corregido para cerrar
 *              correctamente el cuerpo del componente, resolviendo un error de sintaxis.
 * @author Raz Podestá
 * @version 6.0.1
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
      <WelcomeHero
        username={username}
        searchPlaceholder={t("welcomeHero.searchPlaceholder")}
      />
      <ActionDock />
      <RecentActivity recentCampaigns={recentCampaigns} />
    </div>
  );
} // <-- LLAVE DE CIERRE FALTANTE AÑADIDA
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Sintaxis**: ((Implementada)) Se ha añadido la llave de cierre faltante, resolviendo el error de compilación.
 *
 * @subsection Melhorias Futuras
 * 1. **Renderizado Condicional de Módulos**: ((Vigente)) Este componente podría ser extendido para renderizar condicionalmente sus hijos.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/dashboard-client.tsx
