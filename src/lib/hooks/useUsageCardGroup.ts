// src/lib/hooks/useUsageCardGroup.ts
/**
 * @file src/lib/hooks/useUsageCardGroup.ts
 * @description Hook Soberano que encapsula la lógica de negocio, de estado y
 *              de transformación de datos para el componente `DashboardUsageCardGroup`.
 *              Es la SSoT que consume datos reales del contexto del dashboard y los
 *              mapea al contrato de datos de presentación requerido por la UI.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useMemo } from "react";
import { type LucideIconName } from "@/config/lucide-icon-names";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";
import { type Enums } from "@/lib/types/database";

/**
 * @public
 * @interface UsageCardData
 * @description Contrato de datos de presentación para una única tarjeta de métrica.
 *              Es la SSoT para la UI, desacoplándola del modelo de datos de la DB.
 */
export interface UsageCardData {
  title: string;
  iconName: LucideIconName;
  iconColorClass: string;
  value: number;
  change: string;
}

/**
 * @public
 * @function useUsageCardGroup
 * @description Hook que provee toda la lógica y datos transformados para el `DashboardUsageCardGroup`.
 * @returns Un objeto con la lista de tarjetas de métricas, el estado de carga y
 *          las variantes de animación.
 */
export function useUsageCardGroup() {
  clientLogger.trace("[useUsageCardGroup] Hook soberano inicializado.");

  const t = useTypedTranslations(
    "components.dashboard.DashboardUsageCardGroup"
  );
  const {
    activeSitesCount,
    publishedCampaignsCount,
    uniqueVisitors30d,
    aiCreditsRemaining,
    profile,
    maxSitesAllowed,
  } = useDashboard();

  const isLoading = !profile;

  const cards: UsageCardData[] = useMemo(() => {
    if (isLoading) {
      return [];
    }

    const userPlanType = (profile.plan_type || "free") as Enums<"plan_type">;

    return [
      {
        title: t("sites_active_title"),
        iconName: "LayoutGrid",
        iconColorClass: "text-green-500",
        value: activeSitesCount,
        change:
          userPlanType === "free"
            ? t("sites_active_change_free_plan", { count: maxSitesAllowed })
            : t("sites_active_change_pro_plan"),
      },
      {
        title: t("campaigns_published_title"),
        iconName: "Rocket",
        iconColorClass: "text-indigo-500",
        value: publishedCampaignsCount,
        change: t("campaigns_published_change", { percent: 15 }), // Placeholder
      },
      {
        title: t("visitors_30d_title"),
        iconName: "Users",
        iconColorClass: "text-yellow-500",
        value: uniqueVisitors30d,
        change: t("visitors_30d_change", { percent: 10 }), // Placeholder
      },
      {
        title: t("ai_credits_title"),
        iconName: "Bot",
        iconColorClass: "text-primary",
        value: aiCreditsRemaining,
        change:
          aiCreditsRemaining === 0
            ? t("ai_credits_change_renews")
            : t("ai_credits_change_remaining", { count: aiCreditsRemaining }),
      },
    ];
  }, [
    isLoading,
    profile,
    t,
    activeSitesCount,
    publishedCampaignsCount,
    uniqueVisitors30d,
    aiCreditsRemaining,
    maxSitesAllowed,
  ]);

  const animationVariants = {
    STAGGER_CONTAINER: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
      },
    },
    FADE_UP: {
      hidden: { opacity: 0, y: 10 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    },
  };

  return {
    cards,
    isLoading,
    animationVariants,
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Cálculo de Porcentaje de Cambio**: La lógica para los placeholders `{percent}` está actualmente codificada en duro. Este hook debería ser extendido para calcular el cambio porcentual real comparando con el período anterior (ej. consultando `visitor_logs` para los 30 días previos).
 * 2. **Tipado de Claves de i18n**: Las aserciones `as any` en `t()` son pragmáticas. Se podrían refinar los tipos para una seguridad aún mayor.
 * 3. **Abstracción de `planDetailsMap`**: La lógica de mapeo de planes podría ser extraída a un helper si se reutiliza en otras partes de la aplicación.
 * 4. **Manejo de Errores de Contexto**: Añadir un bloque `try/catch` alrededor de `useDashboard` para manejar el caso en que el hook se use fuera de su proveedor.
 * 5. **Abstracción de Animaciones**: Centralizar las `animationVariants` en un manifiesto `src/config/animations.config.ts`.
 * =====================================================================
 */
// src/lib/hooks/useUsageCardGroup.ts
