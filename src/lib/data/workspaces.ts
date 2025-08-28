// src/lib/data/workspaces.ts
/**
 * @file src/lib/data/workspaces.ts
 * @description Aparato de datos para la entidad 'workspaces'. Restaurado para
 *              incluir `getWorkspaceById` y optimizado con `React.cache`.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.2.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";

import { cache } from "react";
import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

export type Workspace = Tables<"workspaces">;
type Supabase = SupabaseClient<
  import("@/lib/types/database").Database,
  "public"
>;

export const getWorkspacesByUserId = cache(
  async (userId: string, supabaseClient?: Supabase): Promise<Workspace[]> => {
    logger.trace(`[Cache MISS] Cargando workspaces para usuario: ${userId}`);
    const supabase = supabaseClient || createServerClient();
    try {
      const { data, error } = await supabase
        .from("workspace_members")
        .select("workspaces(*)")
        .eq("user_id", userId);

      if (error) throw new Error("No se pudieron cargar los workspaces.");

      return data?.flatMap((item) => item.workspaces || []) || [];
    } catch (error) {
      logger.error(`Error al obtener workspaces para ${userId}:`, error);
      return [];
    }
  }
);

// --- INICIO DE RESTAURACIÓN DE FUNCIONALIDAD (CERO REGRESIONES) ---
export const getWorkspaceById = cache(
  async (
    workspaceId: string,
    supabaseClient?: Supabase
  ): Promise<Pick<Workspace, "id" | "name"> | null> => {
    logger.trace(`[Cache MISS] Cargando workspace por ID: ${workspaceId}`);
    const supabase = supabaseClient || createServerClient();
    try {
      const { data, error } = await supabase
        .from("workspaces")
        .select("id, name")
        .eq("id", workspaceId)
        .single();

      if (error) {
        if (error.code !== "PGRST116") {
          throw new Error(`Error al obtener el workspace ${workspaceId}.`);
        }
        return null;
      }
      return data;
    } catch (error) {
      logger.error(`Error en getWorkspaceById para ${workspaceId}:`, error);
      return null;
    }
  }
);
// --- FIN DE RESTAURACIÓN DE FUNCIONALIDAD ---
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Cero Regresiones:** Se ha restaurado la función `getWorkspaceById`, asegurando que el aparato exporte el 100% de su API original.
 * =====================================================================
 */
// src/lib/data/workspaces.ts
