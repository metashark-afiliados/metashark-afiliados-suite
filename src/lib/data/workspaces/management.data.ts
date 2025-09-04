// src/lib/data/workspaces/management.data.ts
/**
 * @file management.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura para la gestión de workspaces (Dashboard). Sincronizado
 *              con "Lean Database", logging canónico y cacheo dinámico.
 * @author RaZ Podestá - MetaShark Tech
 * @version 6.1.0
 * @see .docs-espejo/lib/data/workspaces/management.data.ts.md
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";

import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type Workspace, type WorkspaceMember } from "./types";

/**
 * @public
 * @async
 * @function getWorkspacesByUserId
 * @description Obtiene todos los workspaces a los que pertenece un usuario.
 * @param {string} userId - El ID del usuario.
 * @returns {Promise<Workspace[]>} Una lista de workspaces.
 */
export const getWorkspacesByUserId = cache(
  async (userId: string): Promise<Workspace[]> => {
    const context = { userId };
    logger.trace(context, "[Cache MISS] Cargando workspaces para usuario.");
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("workspace_members")
        .select("workspaces(*)")
        .eq("user_id", userId);

      if (error) throw error;
      return data?.flatMap((item) => item.workspaces || []) || [];
    } catch (error) {
      logger.error(
        { err: error, ...context },
        "[DataLayer] Fallo al obtener workspaces."
      );
      throw new Error("No se pudieron cargar los workspaces.");
    }
  },
  ["workspaces_by_user_id"],
  { tags: ["workspaces"] }
);

/**
 * @public
 * @async
 * @function getWorkspaceById
 * @description Obtiene los datos básicos de un workspace por su ID.
 * @param {string} workspaceId - El ID del workspace.
 * @returns {Promise<Pick<Workspace, "id" | "name" | "icon"> | null>}
 */
export async function getWorkspaceById(
  workspaceId: string
): Promise<Pick<Workspace, "id" | "name" | "icon"> | null> {
  const cacheKey = ["workspace_by_id", workspaceId];
  const tags = [`workspace:${workspaceId}`];
  const context = { workspaceId };

  return cache(
    async () => {
      logger.trace(context, "[Cache MISS] Cargando workspace por ID.");
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("workspaces")
          .select("id, name, icon")
          .eq("id", workspaceId)
          .single();

        if (error && error.code !== "PGRST116") throw error;
        return data;
      } catch (error) {
        logger.error(
          { err: error, ...context },
          "[DataLayer] Fallo en getWorkspaceById."
        );
        throw new Error("No se pudo cargar el workspace por ID.");
      }
    },
    cacheKey,
    { tags }
  )();
}

/**
 * @public
 * @async
 * @function getWorkspaceMembers
 * @description Obtiene todos los miembros de un workspace, incluyendo su perfil y rol.
 * @param {string} workspaceId - El ID del workspace.
 * @returns {Promise<WorkspaceMember[]>} Una lista de miembros del workspace.
 */
export async function getWorkspaceMembers(
  workspaceId: string
): Promise<WorkspaceMember[]> {
  const context = { workspaceId };
  logger.trace(context, "[DataLayer] Cargando miembros para workspace.");
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("workspace_members")
      .select(
        `*, profiles (id, email, full_name, avatar_url), workspace_roles (name)`
      )
      .eq("workspace_id", workspaceId);

    if (error) throw error;
    return (data as WorkspaceMember[]) || [];
  } catch (error) {
    logger.error(
      { err: error, ...context },
      `[DataLayer] Fallo al obtener miembros.`
    );
    throw new Error("No se pudieron obtener los miembros del workspace.");
  }
}
// src/lib/data/workspaces/management.data.ts
