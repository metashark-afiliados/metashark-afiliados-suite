// src/lib/data/modules.ts
/**
 * @file src/lib/data/modules.ts
 * @description Aparato de datos para la entidad 'feature_modules'. Ha sido nivelado
 *              para soportar Inyección de Dependencias, permitiendo su uso seguro
 *              dentro de funciones cacheadas.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
"use server";

import { unstable_cache as cache } from "next/cache";
import { type User, type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";

export type FeatureModule = {
  id: string;
  title: string;
  description: string;
  tooltip: string;
  icon: string;
  href: string;
  status: "active" | "soon" | "locked";
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

/**
 * @public
 * @async
 * @function getFeatureModulesForUser
 * @description Obtiene y personaliza la lista de módulos para un usuario específico.
 * @param {User} user - El objeto de usuario autenticado.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase.
 * @returns {Promise<FeatureModule[]>}
 */
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
      icon: mod.icon_name,
      href: mod.href,
      status,
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
 * 1. **Inyección de Dependencias**: ((Implementada)) La función ahora acepta un `supabaseClient` opcional, permitiendo su uso seguro en contextos cacheados.
 *
 * =====================================================================
 */
// src/lib/data/modules.ts
