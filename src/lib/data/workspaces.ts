// src/lib/data/workspaces.ts
/**
 * @file src/lib/data/workspaces.ts
 * @description Aparato de datos para la entidad 'workspaces'. Ha sido nivelado
 *              a un estándar de élite para soportar Inyección de Dependencias,
 *              permitiendo que sus funciones sean utilizadas dentro de contextos
 *              cacheados de forma segura.
 * @author Raz Podestá
 * @version 3.0.0
 */
"use server";

import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

export type Workspace = Tables<"workspaces">;
type Supabase = SupabaseClient<Database, "public">; // Corregido para mayor precisión de tipo
type Database = import("@/lib/types/database").Database;

/**
 * @public
 * @async
 * @function getWorkspacesByUserId
 * @description Obtiene todos los workspaces a los que un usuario pertenece.
 * @param {string} userId - El ID del usuario.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase.
 * @returns {Promise<Workspace[]>}
 */
export async function getWorkspacesByUserId(
  userId: string,
  supabaseClient?: Supabase
): Promise<Workspace[]> {
  const supabase = supabaseClient || createServerClient();
  try {
    const { data, error } = await supabase
      .from("workspace_members")
      .select("workspaces(*)")
      .eq("user_id", userId);

    if (error) {
      throw new Error("No se pudieron cargar los datos de los workspaces.");
    }
    return data?.flatMap((item) => item.workspaces || []) || [];
  } catch (error) {
    logger.error(`Error al obtener workspaces para ${userId}:`, error);
    return [];
  }
}

/**
 * @public
 * @async
 * @function getWorkspaceById
 * @description Obtiene la información básica de un workspace por su ID.
 * @param {string} workspaceId - El ID del workspace.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase.
 * @returns {Promise<Pick<Workspace, "id" | "name"> | null>}
 */
export async function getWorkspaceById(
  workspaceId: string,
  supabaseClient?: Supabase
): Promise<Pick<Workspace, "id" | "name"> | null> {
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Inyección de Dependencias**: ((Implementada)) Todas las funciones ahora aceptan un `supabaseClient` opcional. Esto las desacopla de la creación directa del cliente, haciéndolas más puras, testeables y seguras para usar dentro de funciones cacheadas.
 *
 * @subsection Melhorias Futuras
 * 1. **Cacheo con `React.cache`**: ((Vigente)) Estas funciones siguen siendo candidatas ideales para ser envueltas individualmente en `React.cache`.
 *
 * =====================================================================
 */
// src/lib/data/workspaces.ts
