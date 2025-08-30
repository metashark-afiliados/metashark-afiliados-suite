// src/lib/hooks/useSubscriptionData.ts
/**
 * @file src/lib/hooks/useSubscriptionData.ts
 * @description Hook soberano y de élite. Es la Única Fuente de Verdad (SSoT) para
 *              obtener y transformar los datos de suscripción del usuario. Consume
 *              el contexto del dashboard y el namespace de i18n para construir el
 *              modelo de presentación que requiere la UI.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
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
  clientLogger.trace("[useSubscriptionData] Hook soberano inicializado.");

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
      basic: {
        planNameKey: "plan_pro_name", // Placeholder
        descriptionKey: "plan_pro_description",
        priceKey: "plan_pro_price",
      },
      pro: {
        planNameKey: "plan_pro_name",
        descriptionKey: "plan_pro_description",
        priceKey: "plan_pro_price",
      },
      enterprise: {
        planNameKey: "plan_pro_name", // Placeholder
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
        status: "active", // Placeholder
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
 * 1. **Integración con Datos de Stripe**: La mejora de élite es reemplazar la lógica de simulación actual por una llamada a una Server Action `getSubscriptionData` que obtenga datos reales de la tabla `subscriptions` (sincronizada con Stripe), incluyendo el estado real (`trialing`, `past_due`, etc.).
 * 2. **Tipado Estricto de Claves de i18n**: Las aserciones `as any` en `t()` son pragmáticas. Se podrían refinar los tipos, o crear un helper de i18n que construya las claves de forma dinámica y segura (ej. `t(getPlanI18nKey(userPlan, 'name'))`), para eliminar el `any`.
 * 3. **Manejo de Múltiples Suscripciones**: El hook actualmente solo modela una suscripción. Debería ser extendido para manejar un array de suscripciones si el modelo de negocio lo permite.
 * 4. **Manejo de Errores de Contexto**: Añadir un bloque `try/catch` alrededor de `useDashboard` para manejar el caso en que el hook se use fuera de su proveedor, devolviendo un estado de error explícito.
 * 5. **Abstracción de `planDetailsMap`**: La lógica de mapeo de planes podría ser extraída a un manifiesto de configuración (`src/config/plans.config.ts`) si se reutiliza en otras partes de la aplicación (ej. en la página de precios).
 * =====================================================================
 */
// src/lib/hooks/useSubscriptionData.ts
