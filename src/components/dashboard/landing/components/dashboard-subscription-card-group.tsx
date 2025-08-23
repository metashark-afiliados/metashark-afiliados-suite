// src/components/dashboard/landing/components/dashboard-subscription-card-group.tsx
"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { ErrorContent } from "@/components/dashboard/layout/error-content";
import {
  SubscriptionCards,
  type Subscription,
} from "@/components/dashboard/subscriptions/components/subscription-cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/lib/context/DashboardContext";

/**
 * @public
 * @component DashboardSubscriptionCardGroup
 * @description Orquestador de UI que consume el contexto del dashboard,
 *              transforma los datos del perfil del usuario en el contrato
 *              `Subscription[]`, y los pasa al componente de presentación `SubscriptionCards`.
 * @returns {React.ReactElement}
 * @version 3.0.0
 * @author Raz Podestá
 */
export function DashboardSubscriptionCardGroup() {
  const t = useTranslations("DashboardSubscriptionCard");
  const { profile } = useDashboard();

  if (!profile) {
    return <ErrorContent />;
  }

  // Lógica de Adaptación de Datos: Transforma los datos del contexto al
  // contrato esperado por el componente hijo.
  const userPlan = profile.plan_type || "free";
  const planDetails = {
    free: {
      planNameKey: "plan_free_name",
      descriptionKey: "plan_free_description",
      priceKey: "plan_free_price",
    },
    pro: {
      planNameKey: "plan_pro_name",
      descriptionKey: "plan_pro_description",
      priceKey: "plan_pro_price",
    },
  };
  const details =
    planDetails[userPlan as keyof typeof planDetails] || planDetails.free;

  const userSubscriptions: Subscription[] = [
    {
      id: `sub_${profile.id}`,
      planName: t(details.planNameKey as any),
      description: t(details.descriptionKey as any),
      price: t(details.priceKey as any),
      frequency: t("frequency_monthly"),
      status: "active",
    },
  ];

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
          subscriptions={userSubscriptions}
        />
      </CardContent>
    </Card>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución Arquitectónica de Error de Tipo**: ((Implementada)) La refactorización resuelve el `TS2459` de forma sistémica al adoptar un flujo de datos unidireccional, eliminando la dependencia de tipo ascendente.
 * 2. **Alineación con Blueprint de Referencia**: ((Implementada)) Los componentes ahora siguen la arquitectura de élite del proyecto `paddle-kit`, donde los componentes padres obtienen y adaptan los datos, y los hijos son presentadores puros.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipos de Datos Centralizados**: ((Vigente)) El tipo `Subscription` podría ser movido a un archivo de tipos compartido (ej. `src/types/billing.d.ts`) si otros componentes necesitaran consumirlo, para un mejor cumplimiento de DRY.
 *
 * =====================================================================
 */
// src/components/dashboard/landing/components/dashboard-subscription-card-group.tsx
