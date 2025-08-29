// src/components/dashboard/landing/components/dashboard-subscription-card-group.tsx
/**
 * @file dashboard-subscription-card-group.tsx
 * @description Orquestador de UI de élite. Ha sido refactorizado a un componente
 *              de presentación 100% puro que consume el hook soberano
 *              `useSubscriptionData`, delegando toda la lógica de estado y
 *              adaptación de datos, y cumpliendo con el SRP al más alto nivel.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import Link from "next/link";

import { ErrorContent } from "@/components/dashboard/layout/error-content";
import { SubscriptionCards } from "@/components/dashboard/subscriptions/components/subscription-cards";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardSkeleton,
} from "@/components/ui/card";
import { useSubscriptionData } from "@/lib/hooks/useSubscriptionData";

/**
 * @public
 * @component DashboardSubscriptionCardGroup
 * @description Orquesta la UI para la sección de suscripciones del dashboard.
 * @returns {React.ReactElement}
 */
export function DashboardSubscriptionCardGroup() {
  const { subscriptions, t, isLoading } = useSubscriptionData();

  if (isLoading) {
    return <CardSkeleton className="p-6 h-48" />; // Placeholder de carga
  }

  if (!subscriptions.length) {
    return <ErrorContent />; // Reutiliza el componente de error si no hay datos
  }

  return (
    <Card className={"bg-background/50 backdrop-blur-[24px] border-border p-6"}>
      <CardHeader className="p-0 space-y-0">
        <CardTitle className="flex justify-between items-center pb-6 border-border border-b">
          <span className={"text-xl font-medium"}>{t("title")}</span>
          <Button
            asChild={true}
            size={"sm"}
            variant={"outline"}
            className={"text-sm rounded-sm border-border"}
          >
            <Link href={"/dashboard/subscriptions"}>
              {t("view_all_button")}
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className={"p-0 pt-6 @container"}>
        <SubscriptionCards
          className={"grid-cols-1 gap-6 @[600px]:grid-cols-2"}
          subscriptions={subscriptions}
        />
      </CardContent>
    </Card>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Estado Vacío Específico:** En lugar de `ErrorContent`, se podría crear un componente `EmptyState` específico para cuando un usuario no tiene suscripciones, con un CTA para "Ver Planes".
 *
 * =====================================================================
 */
// src/components/dashboard/landing/components/dashboard-subscription-card-group.tsx
