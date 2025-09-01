// src/lib/data/workspaces/management.data.ts
/**
 * @file src/lib/data/workspaces/management.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura para la gestión de workspaces. Sincronizado con la
 *              arquitectura "Lean Database".
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-09-01
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";
import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logger";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";
import { type Workspace } from "./types";

type Database = import("@/lib/types/database").Database;
type Supabase = SupabaseClient<Database, "public">;

export const getWorkspacesByUserId = cache(
  async (userId: string): Promise<Workspace[]> => {
    logger.trace({ userId }, `[Cache MISS] Cargando workspaces para usuario.`);
    const supabase = createServerClient();
    try {
      const { data, error } = await supabase
        .from("workspace_members")
        .select("workspaces(*)")
        .eq("user_id", userId);
      if (error) throw new Error("No se pudieron cargar los workspaces.");
      return data?.flatMap((item) => item.workspaces || []) || [];
    } catch (error) {
      logger.error({ error }, `Error al obtener workspaces para ${userId}.`);
      return [];
    }
  },
  ["workspaces"],
  { tags: ["workspaces"] }
);

export const getWorkspaceById = cache(
  async (
    workspaceId: string
  ): Promise<Pick<Workspace, "id" | "name" | "icon"> | null> => {
    logger.trace({ workspaceId }, `[Cache MISS] Cargando workspace por ID.`);
    const supabase = createServerClient();
    try {
      const { data, error } = await supabase
        .from("workspaces")
        .select("id, name, icon")
        .eq("id", workspaceId)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    } catch (error) {
      logger.error({ error }, `Error en getWorkspaceById para ${workspaceId}.`);
      return null;
    }
  },
  ["workspace_by_id"],
  { tags: ["workspaces"] }
);

export async function getWorkspaceMembers(
  workspaceId: string
): Promise<
  (Tables<"workspace_members"> & {
    profiles: Tables<"profiles"> | null;
    workspace_roles: { name: string } | null;
  })[]
> {
  logger.trace(
    { workspaceId },
    `[DataLayer:Workspaces] Cargando miembros para workspace.`
  );
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("workspace_members")
      .select(
        `
        *,
        profiles (id, email, full_name, avatar_url),
        workspace_roles (name)
      `
      )
      .eq("workspace_id", workspaceId);

    if (error) {
      logger.error(
        { error },
        `Error al obtener miembros del workspace ${workspaceId}.`
      );
      throw new Error("No se pudieron obtener los miembros del workspace.");
    }
    return data || [];
  } catch (error) {
    logger.error(
      { error },
      `Error en getWorkspaceMembers para ${workspaceId}.`
    );
    return [];
  }
}
// src/lib/data/workspaces/management.data.ts
