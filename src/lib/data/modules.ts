// src/lib/data/modules.ts
/**
 * @file src/lib/data/modules.ts
 * @description Aparato de datos para la entidad 'feature_modules'. Ha sido
 *              refactorizado a un estándar de élite, eliminando una lógica de
 *              reordenamiento incorrecta que violaba el contrato de datos,
 *              mejorando la seguridad de tipos y alineando el logging con la
 *              firma canónica.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 */
"use server";

import { type SupabaseClient, type User } from "@supabase/supabase-js";
import { unstable_cache as cache } from "next/cache";

import { logger } from "@/lib/logger";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Enums, type Tables } from "@/lib/types/database";

export type FeatureModule = {
  id: string;
  title: string;
  description: string;
  tooltip: string | null;
  icon: string;
  href: string;
  status: "active" | "soon" | "locked";
  required_plan: Enums<"plan_type">;
  display_order: number;
};

type PlanHierarchy = "free" | "pro" | "enterprise";
type Database = import("@/lib/types/database").Database;
type Supabase = SupabaseClient<Database, "public">;

const getBaseModules = cache(
  async (supabaseClient?: Supabase): Promise<Tables<"feature_modules">[]> => {
    logger.info(
      {},
      `[Cache MISS] Cargando feature_modules base desde la base de datos.`
    );
    const supabase = supabaseClient || createServerClient();
    try {
      const { data, error } = await supabase
        .from("feature_modules")
        .select("*")
        .order("display_order");

      if (error) {
        throw error;
      }
      return data || [];
    } catch (error) {
      logger.error({ err: error }, "Error crítico al obtener feature_modules.");
      return []; // Return empty on critical error to prevent crash
    }
  },
  ["feature_modules"],
  { tags: ["feature_modules"] }
);

export async function getFeatureModulesForUser(
  user: User,
  supabaseClient?: Supabase
): Promise<FeatureModule[]> {
  const baseModules = await getBaseModules(supabaseClient);

  if (!baseModules || baseModules.length === 0) {
    return [];
  }

  const planHierarchy: Record<PlanHierarchy, number> = {
    free: 1,
    pro: 2,
    enterprise: 3,
  };
  // @ts-ignore - Supabase user type doesn't include our custom app_metadata
  const userPlan = (user.app_metadata?.plan as PlanHierarchy) || "free";
  const userLevel = planHierarchy[userPlan] || 1;

  const modulesWithStatus: FeatureModule[] = baseModules.map(
    (mod: Tables<"feature_modules">) => {
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
        icon: mod.icon_name,
        href: mod.href,
        status,
        required_plan: mod.required_plan,
        display_order: mod.display_order,
      };
    }
  );

  return modulesWithStatus;
}
// src/lib/data/modules.ts
