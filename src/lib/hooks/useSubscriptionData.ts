// src/lib/hooks/useSubscriptionData.ts
/**
 * @file useSubscriptionData.ts
 * @description Hook soberano y de élite. Es la Única Fuente de Verdad (SSoT) para
 *              obtener y transformar los datos de suscripción del usuario. Ha sido
 *              refactorizado holísticamente para consumir el namespace de i18n
 *              canónico y para alinearse con el contrato de datos `plan_type`
 *              de la base de datos, resolviendo todos los errores de tipo.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useMemo } from "react";

import { type Subscription } from "@/components/dashboard/subscriptions/components/subscription-cards";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";
import { type Enums } from "../types/database";

/**
 * @public
 * @function useSubscriptionData
 * @description Orquesta la obtención y transformación de los datos de suscripción del usuario.
 * @returns {{ subscriptions: Subscription[], t: any, isLoading: boolean }} Un objeto con la lista
 *          de suscripciones listas para renderizar, la función de traducción y el estado de carga.
 */
export function useSubscriptionData() {
  clientLogger.trace("[useSubscriptionData] Inicializando hook soberano.");

  const t = useTypedTranslations(
    "components.dashboard.DashboardSubscriptionCard"
  );
  const { profile } = useDashboard();
  const isLoading = !profile;

  const subscriptions = useMemo((): Subscription[] => {
    if (!profile) {
      return [];
    }

    const userPlan = (profile.plan_type || "free") as Enums<"plan_type">;
    const planDetailsMap: Record<
      Enums<"plan_type">,
      { planNameKey: string; descriptionKey: string; priceKey: string }
    > = {
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
      basic: {
        planNameKey: "plan_pro_name",
        descriptionKey: "plan_pro_description",
        priceKey: "plan_pro_price",
      },
      enterprise: {
        planNameKey: "plan_pro_name",
        descriptionKey: "plan_pro_description",
        priceKey: "plan_pro_price",
      },
    };

    const details = planDetailsMap[userPlan] || planDetailsMap.free;

    return [
      {
        id: `sub_${profile.id}`,
        planName: t(details.planNameKey as any),
        description: t(details.descriptionKey as any),
        price: t(details.priceKey as any),
        frequency: t("frequency_monthly"),
        status: "active",
      },
    ];
  }, [profile, t]);

  return {
    subscriptions,
    t,
    isLoading,
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Integración con Datos de Stripe**: La mejora de élite sigue siendo la integración con una Server Action `getSubscriptionData` que obtenga datos reales de la tabla `subscriptions`, la cual estaría sincronizada con Stripe.
 * 2. **Tipado Estricto de Claves de Plan**: El `as any` en las llamadas a `t()` puede ser eliminado si el tipo de `planDetailsMap` se define de forma que TypeScript pueda inferir que sus claves son válidas para el namespace `components.dashboard.DashboardSubscriptionCard`, o si se utiliza un helper de i18n para construir las claves dinámicamente.
 * 3. **Manejo de Estados de Suscripción**: El estado `status` está codificado como "active". Una vez integrado con Stripe, este valor debería reflejar el estado real de la suscripción (`trialing`, `past_due`, etc.).
 * 4. **Soporte para Múltiples Suscripciones**: El hook actualmente solo modela una suscripción. Debería ser extendido para manejar un array de suscripciones si el modelo de negocio lo permite.
 * =====================================================================
 */
