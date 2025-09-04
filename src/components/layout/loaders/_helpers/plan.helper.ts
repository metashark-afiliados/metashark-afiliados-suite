// src/components/layout/loaders/_helpers/plan.helper.ts
/**
 * @file plan.helper.ts
 * @description Aparato de lógica de negocio puro y atómico. Actúa como la SSoT
 *              para mapear un tipo de plan a sus límites numéricos.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import "server-only";

import { type Enums } from "@/lib/types/database";

/**
 * @public
 * @function getPlanMaxSites
 * @description Convierte un `plan_type` en el número máximo de sitios permitidos.
 * @param {Enums<'plan_type'>} planType - El tipo de plan del usuario.
 * @returns {number} El número máximo de sitios permitidos para ese plan.
 */
export const getPlanMaxSites = (planType: Enums<"plan_type">): number => {
  const planToMaxSitesMap: Record<Enums<"plan_type">, number> = {
    free: 1,
    basic: 5,
    pro: 25,
    enterprise: 500,
  };
  return planToMaxSitesMap[planType] || 1; // Fallback a 1 si el plan no es reconocido.
};
// src/components/layout/loaders/_helpers/plan.helper.ts
