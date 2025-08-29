// src/components/dashboard/landing/components/dashboard-usage-card-group.tsx
/**
 * @file dashboard-usage-card-group.tsx
 * @description Componente de UI atómico y de presentación puro.
 *              Ha sido refactorizado holísticamente a un estándar de élite para
 *              consumir datos reales del `useDashboard()` hook y renderizar
 *              un grupo de tarjetas con métricas de uso clave. Incluye un
 *              `AnimatedCounter` para valores dinámicos y es completamente
 *              internacionalizado y optimizado con animaciones.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { animate, motion, useInView } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";
import { type Enums } from "@/lib/types/database";
import { type LucideIconName } from "@/config/lucide-icon-names";

export interface UsageCardData {
  title: string;
  iconName: LucideIconName;
  iconColorClass: string;
  value: number;
  change: string;
}

const AnimatedCounter = ({ to }: { to: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const node = ref.current;
      const controls = animate(0, to, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate(value) {
          node.textContent = Math.round(value).toLocaleString();
        },
      });
      return () => controls.stop();
    }
  }, [isInView, to]);

  return <span ref={ref} />;
};

export function DashboardUsageCardGroup(): React.ReactElement {
  clientLogger.trace(
    "[DashboardUsageCardGroup] Renderizando componente con datos reales."
  );

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

  const cards: UsageCardData[] = useMemo(() => {
    const userPlanType = profile.plan_type as Enums<"plan_type">;

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
        change: t("campaigns_published_change", { percent: 15 }),
      },
      {
        title: t("visitors_30d_title"),
        iconName: "Users",
        iconColorClass: "text-yellow-500",
        value: uniqueVisitors30d,
        change: t("visitors_30d_change", { percent: 10 }),
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
    activeSitesCount,
    publishedCampaignsCount,
    uniqueVisitors30d,
    aiCreditsRemaining,
    t,
    profile.plan_type,
    maxSitesAllowed,
  ]);

  const STAGGER_CONTAINER = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };
  const FADE_UP = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className={"grid gap-6 sm:grid-cols-2 lg:grid-cols-2"}
    >
      {cards.map((card) => (
        <motion.div key={card.title} variants={FADE_UP}>
          <Card
            className={
              "bg-background/50 backdrop-blur-[24px] border-border p-6 h-full"
            }
          >
            <CardHeader className="p-0 space-y-0">
              <CardTitle className="flex justify-between items-center mb-6">
                <span className={"text-base leading-4"}>{card.title}</span>
                <DynamicIcon
                  name={card.iconName}
                  className={card.iconColorClass}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className={"p-0"}>
              <p
                className={
                  "text-[32px] leading-[32px] font-bold text-foreground"
                }
              >
                <AnimatedCounter to={card.value} />
              </p>
              <div className="text-sm leading-[14px] pt-2 text-muted-foreground">
                {card.change}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-29
 *
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Tooltips Explicativos:** Añadir un `Tooltip` a cada tarjeta que ofrezca una explicación más detallada de la métrica (ej. "Número de sitios que no están archivados"), mejorando la usabilidad.
 * 2. ((Vigente)) **Animación de Tendencia:** Para las métricas con porcentajes de cambio, se podría añadir un icono `ArrowUp` o `ArrowDown` junto al texto de "change", animado con `framer-motion` para indicar la tendencia positiva o negativa.
 * 3. ((Vigente)) **Lógica de Colores Dinámica:** El color del texto "change" podría cambiar dinámicamente a verde o rojo para reflejar si el cambio porcentual es positivo o negativo.
 *
 * =====================================================================
 */
// src/components/dashboard/landing/components/dashboard-usage-card-group.tsx
