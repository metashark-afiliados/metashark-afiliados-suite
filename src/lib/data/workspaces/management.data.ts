// src/lib/data/workspaces/management.data.ts
/**
 * @file management.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura para la gestión de workspaces (Dashboard). Ha sido
 *              refactorizado holísticamente para utilizar `unstable_cache` de
 *              `next/cache`, resolviendo el error de runtime y alineándose
 *              con la SSoT de cacheo canónica.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-30
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";
import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";
import { type Workspace } from "./types";

type Supabase = SupabaseClient<
  import("@/lib/types/database").Database,
  "public"
>;

/**
 * @public
 * @async
 * @function getWorkspacesByUserId
 * @description Obtiene todos los workspaces a los que pertenece un usuario.
 *              La consulta está envuelta en `unstable_cache`.
 * @param {string} userId - El ID del usuario.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase.
 * @returns {Promise<Workspace[]>} Un array con los workspaces del usuario.
 */
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
  },
  ["workspaces"],
  { tags: ["workspaces"] }
);

/**
 * @public
 * @async
 * @function getWorkspaceById
 * @description Obtiene los datos básicos de un workspace por su ID.
 *              La consulta está envuelta en `unstable_cache`.
 * @param {string} workspaceId - El ID del workspace a obtener.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase.
 * @returns {Promise<Pick<Workspace, "id" | "name" | "icon"> | null>}
 */
export const getWorkspaceById = cache(
  async (
    workspaceId: string,
    supabaseClient?: Supabase
  ): Promise<Pick<Workspace, "id" | "name" | "icon"> | null> => {
    logger.trace(`[Cache MISS] Cargando workspace por ID: ${workspaceId}`);
    const supabase = supabaseClient || createServerClient();
    try {
      const { data, error } = await supabase
        .from("workspaces")
        .select("id, name, icon")
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
  },
  ["workspace_by_id"],
  { tags: ["workspaces"] }
);

/**
 * @public
 * @async
 * @function getWorkspaceMembers
 * @description Obtiene todos los miembros de un workspace específico.
 * @param {string} workspaceId - El ID del workspace.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase.
 * @returns {Promise<Tables<'workspace_members'>[]>} Un array de miembros del workspace.
 */
export async function getWorkspaceMembers(
  workspaceId: string,
  supabaseClient?: Supabase
): Promise<Tables<"workspace_members">[]> {
  logger.trace(
    `[DataLayer:Workspaces] Cargando miembros para workspace: ${workspaceId}`
  );
  const supabase = supabaseClient || createServerClient();
  try {
    const { data, error } = await supabase
      .from("workspace_members")
      .select("*, profiles(id, email, full_name, avatar_url)")
      .eq("workspace_id", workspaceId);

    if (error) {
      logger.error(
        `Error al obtener miembros del workspace ${workspaceId}:`,
        error
      );
      throw new Error("No se pudieron obtener los miembros del workspace.");
    }
    return (data as Tables<"workspace_members">[]) || [];
  } catch (error) {
    logger.error(`Error en getWorkspaceMembers para ${workspaceId}:`, error);
    return [];
  }
}
// src/lib/data/workspaces/management.data.ts
