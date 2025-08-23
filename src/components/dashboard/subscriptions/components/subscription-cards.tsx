// src/components/dashboard/subscriptions/components/subscription-cards.tsx
"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Status } from "@/components/shared/status/status";
import { cn } from "@/lib/utils";

/**
 * @public
 * @interface Subscription
 * @description Contrato de datos de presentación para una única suscripción.
 *              Este tipo se define aquí y es exportado para que el componente
 *              padre pueda construir y pasar datos que cumplan con este contrato.
 */
export interface Subscription {
  id: string;
  planName: string;
  description: string;
  price: string;
  frequency: string;
  status: "active" | "canceled" | "trialing" | "past_due";
}

interface Props {
  subscriptions: Subscription[];
  className?: string;
}

/**
 * @public
 * @component SubscriptionCards
 * @description Componente de presentación 100% puro. Su única responsabilidad
 *              es renderizar una lista de tarjetas de suscripción basado en las
 *              props que recibe. Es agnóstico a la fuente de datos.
 * @param {Props} props - Propiedades para configurar el componente.
 * @returns {React.ReactElement}
 * @version 2.0.0
 * @author Raz Podestá
 */
export function SubscriptionCards({ subscriptions, className }: Props) {
  const t = useTranslations("DashboardSubscriptionCard");

  if (subscriptions.length === 0) {
    return (
      <span className={"text-base font-medium"}>
        {t("no_active_subscriptions")}
      </span>
    );
  }

  return (
    <div className={cn("grid flex-1 items-start", className)}>
      {subscriptions.map((subscription) => (
        <Card
          key={subscription.id}
          className={"bg-background/50 backdrop-blur-[24px] border-border p-6"}
        >
          <CardHeader className="p-0 space-y-0">
            <CardTitle className="flex flex-col justify-between items-start mb-6">
              <div className={"flex mb-4 w-full justify-end"}>
                <Link href={`/dashboard/subscriptions/${subscription.id}`}>
                  <ArrowRight size={20} />
                </Link>
              </div>
              <span className={"text-xl leading-7 font-medium"}>
                {subscription.planName}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent
            className={
              "p-0 flex justify-between gap-3 flex-wrap xl:flex-nowrap"
            }
          >
            <div className={"flex flex-col gap-3"}>
              <div className="text-base leading-6 text-muted-foreground">
                {subscription.description}
              </div>
              <div className="text-base leading-[16px] text-primary">
                {subscription.price}
                <span className="text-muted-foreground">
                  /{subscription.frequency}
                </span>
              </div>
            </div>
            <Status status={subscription.status} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Presentación Puro**: ((Implementada)) El componente ya no tiene lógica de datos. Su única responsabilidad es renderizar, lo que lo hace más simple, reutilizable y alineado con la "Filosofía LEGO".
 * 2. **Contrato de API Explícito**: ((Implementada)) Ahora exporta su propio contrato de datos (`Subscription`), informando a los componentes padres exactamente qué forma deben tener los datos que le pasan.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente `Status` Faltante**: ((Vigente)) La dependencia del componente `Status` persiste y debe ser creada.
 *
 * =====================================================================
 */
// src/components/dashboard/subscriptions/components/subscription-cards.tsx
