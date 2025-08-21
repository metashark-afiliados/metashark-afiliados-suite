// src/lib/data/modules.ts
/**
 * @file src/lib/data/modules.ts
 * @description Aparato de datos para la entidad 'feature_modules'. Ha sido
 *              restaurado y refactorizado a un estándar de élite. El contrato
 *              de tipo `FeatureModule` vuelve a usar `icon` para la UI, y la
 *              lógica de transformación `icon_name` -> `icon` se realiza
 *              dentro de la capa de datos, resolviendo la cascada de errores.
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
"use server";

import { unstable_cache as cache } from "next/cache";
import { type User, type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Enums } from "@/lib/types/database";

export type FeatureModule = {
  id: string;
  title: string;
  description: string;
  tooltip: string | null;
  icon: string; // <-- CONTRATO DE UI RESTAURADO
  href: string;
  status: "active" | "soon" | "locked";
  required_plan: Enums<"plan_type">;
  display_order: number;
};

type PlanHierarchy = "free" | "pro" | "enterprise";
type Database = import("@/lib/types/database").Database;
type Supabase = SupabaseClient<Database, "public">;

const getBaseModules = cache(
  async (supabaseClient?: Supabase) => {
    logger.info(
      `[Cache MISS] Cargando feature_modules base desde la base de datos.`
    );
    const supabase = supabaseClient || createServerClient();
    const { data, error } = await supabase
      .from("feature_modules")
      .select("*")
      .order("display_order");

    if (error) {
      logger.error("Error crítico al obtener feature_modules:", error);
      return [];
    }
    return data || [];
  },
  ["feature_modules"],
  { tags: ["feature_modules"] }
);

export async function getFeatureModulesForUser(
  user: User,
  supabaseClient?: Supabase
): Promise<FeatureModule[]> {
  const supabase = supabaseClient || createServerClient();

  const [baseModules, { data: profile }] = await Promise.all([
    getBaseModules(supabase),
    supabase
      .from("profiles")
      .select("dashboard_layout")
      .eq("id", user.id)
      .single(),
  ]);

  if (!baseModules || baseModules.length === 0) {
    return [];
  }

  const planHierarchy: Record<PlanHierarchy, number> = {
    free: 1,
    pro: 2,
    enterprise: 3,
  };
  const userPlan = (user.app_metadata?.plan as PlanHierarchy) || "free";
  const userLevel = planHierarchy[userPlan] || 1;

  const modulesWithStatus: FeatureModule[] = baseModules.map((mod: any) => {
    const requiredLevel =
      planHierarchy[mod.required_plan as PlanHierarchy] || 1;
    const isUnlocked = userLevel >= requiredLevel;
    let status: FeatureModule["status"] = "locked";
    if (isUnlocked) {
      status = mod.status === "active" ? "active" : "soon";
    }

    return {
      id: mod.id,
      title: mod.title,
      description: mod.description,
      tooltip: mod.tooltip ?? "",
      icon: mod.icon_name, // <-- LÓGICA DE TRANSFORMACIÓN
      href: mod.href,
      status,
      required_plan: mod.required_plan,
      display_order: mod.display_order,
    };
  });

  const userLayout = profile?.dashboard_layout as string[] | null;
  if (userLayout && userLayout.length > 0) {
    const moduleMap = new Map(modulesWithStatus.map((mod) => [mod.id, mod]));
    const orderedModules: FeatureModule[] = [];
    const remainingModules = new Set(modulesWithStatus);

    for (const moduleId of userLayout) {
      if (moduleMap.has(moduleId)) {
        const mod = moduleMap.get(moduleId)!;
        orderedModules.push(mod);
        remainingModules.delete(mod);
      }
    }
    return [...orderedModules, ...Array.from(remainingModules)];
  }

  return modulesWithStatus;
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Restauración de Contrato de UI**: ((Implementada)) Se ha restaurado la propiedad `icon` en el tipo `FeatureModule`. Esto realinea el contrato de la capa de datos con lo que los componentes de UI esperan, resolviendo el error `TS2339`.
 * 2. **Capa de Adaptación (Data Transformation)**: ((Implementada)) La función `getFeatureModulesForUser` ahora realiza la transformación de `icon_name` (de la DB) a `icon` (para la UI). Esta es la implementación canónica de una capa de datos que desacopla la persistencia de la presentación.
 *
 * =====================================================================
 */
