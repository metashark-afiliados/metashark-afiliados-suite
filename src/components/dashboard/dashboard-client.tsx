/**
 * @file dashboard-client.tsx
 * @description Orquestador de UI de élite para el "Hub Creativo". Ha sido
 *              refactorizado para utilizar importaciones atómicas y directas,
 *              resolviendo un error crítico de módulo no encontrado (TS2307) y
 *              alineándose con la arquitectura de componentes desacoplados.
 * @author Raz Podestá - MetaShark Tech
 * @version 9.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";
import { Bolt, Shapes, Sparkles, Timer } from "lucide-react";

import { ActionDock } from "@/components/dashboard/ActionDock";
// --- INICIO DE CORRECCIÓN ARQUITECTÓNICA (Importaciones Atómicas) ---
import { DashboardTeamMembersCard } from "@/components/dashboard/landing/components/dashboard-team-members-card";
import { DashboardTutorialCard } from "@/components/dashboard/landing/components/dashboard-tutorial-card";
import {
  DashboardUsageCardGroup,
  type UsageCardData,
} from "@/components/dashboard/landing/components/dashboard-usage-card-group";
// --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import { useDashboard } from "@/lib/context/DashboardContext";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @component DashboardClient
 * @description Componente de cliente que consume el `DashboardContext` y ensambla
 *              la UI completa para el "Hub Creativo" del dashboard.
 * @returns {React.ReactElement}
 */
export function DashboardClient(): React.ReactElement {
  clientLogger.trace(
    "[DashboardClient] Renderizando orquestador del Hub Creativo."
  );
  const tPage = useTranslations("app.[locale].dashboard.page");
  const tUsage = useTranslations(
    "components.dashboard.DashboardUsageCardGroup"
  );
  const tTutorial = useTranslations(
    "components.dashboard.DashboardTutorialCard"
  );

  const { user, workspaces } = useDashboard();

  const username = user.user_metadata?.full_name || user.email || "User";

  // Construcción del contrato de props para DashboardUsageCardGroup
  const usageCards: UsageCardData[] = [
    {
      title: tUsage("sites_active_title"),
      icon: <Shapes className={"text-muted-foreground"} size={18} />,
      value: workspaces.length,
      change: tUsage("sites_active_change", { count: 3 }),
    },
    {
      title: tUsage("campaigns_published_title"),
      icon: <Bolt className={"text-muted-foreground"} size={18} />,
      value: "7", // Placeholder
      change: tUsage("campaigns_published_change", { percent: 12 }),
    },
    {
      title: tUsage("visitors_30d_title"),
      icon: <Timer className={"text-muted-foreground"} size={18} />,
      value: "1,234", // Placeholder
      change: tUsage("visitors_30d_change", { percent: 5.2 }),
    },
    {
      title: tUsage("ai_credits_title"),
      icon: <Sparkles className={"text-muted-foreground"} size={18} />,
      value: "850", // Placeholder
      change: tUsage("ai_credits_change"),
    },
  ];

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <WelcomeHero
        username={username}
        searchPlaceholder={tPage("welcomeHero.searchPlaceholder")}
      />
      <ActionDock />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardUsageCardGroup cards={usageCards} />
        <div className="flex flex-col gap-6">
          <DashboardTeamMembersCard />
          <DashboardTutorialCard
            title={tTutorial("title")}
            description={tTutorial("description")}
            buttonText={tTutorial("buttonText")}
            buttonHref={tTutorial("buttonHref")}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Módulo (TS2307)**: ((Implementada)) Se ha reemplazado la importación de "barrel file" por importaciones atómicas y directas para cada componente hijo. Esto resuelve el error de compilación y alinea el orquestador con la arquitectura de dependencias canónica, previniendo dependencias circulares.
 *
 * @subsection Melhorias Futuras
 * 1. **Datos de Métricas Dinámicos**: ((Vigente)) ((PRIORIDAD ALTA)) Los valores de métricas como "Campañas Publicadas" y "Visitantes" son actualmente placeholders. El `dashboard.loader.ts` debe ser extendido para calcular estas métricas y proveerlas a través del `DashboardContext` para que este componente las consuma.
 *
 * =====================================================================
 */
