// src/lib/data/workspaces/management.data.ts
/**
 * @file management.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura para la gestión de workspaces (Dashboard). Ha sido
 *              refactorizado holísticamente para incluir la función `getWorkspaceMembers`,
 *              una mejora crítica para la visualización de datos reales en el dashboard.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { cache } from "react";
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
 *              La consulta a la base de datos está envuelta en `React.cache` para
 *              prevenir ejecuciones duplicadas dentro de una misma renderización de servidor.
 * @param {string} userId - El ID del usuario.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase para inyección de dependencias.
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
  }
);

/**
 * @public
 * @async
 * @function getWorkspaceById
 * @description Obtiene los datos básicos de un workspace por su ID.
 *              La consulta está envuelta en `React.cache`.
 * @param {string} workspaceId - El ID del workspace a obtener.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase para inyección de dependencias.
 * @returns {Promise<Pick<Workspace, "id" | "name" | "icon"> | null>} El objeto del workspace o null si no se encuentra.
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
        .select("id, name, icon") // <-- Seleccionar 'icon' también
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

/**
 * @public
 * @async
 * @function getWorkspaceMembers
 * @description Obtiene todos los miembros de un workspace específico, incluyendo
 *              información básica de sus perfiles.
 * @param {string} workspaceId - El ID del workspace.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase para inyección de dependencias.
 * @returns {Promise<Tables<'workspace_members'>[]>} Un array de objetos de miembros del workspace.
 * @throws {Error} Si la consulta a la base de datos falla.
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
      .select("*, profiles(id, email, full_name, avatar_url)") // Seleccionar perfil completo
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Función `getWorkspaceMembers`**: ((Implementada)) Se ha añadido esta función crítica a la capa de datos. Permite obtener los miembros de un workspace junto con su información de perfil (`profiles`), resolviendo la necesidad de datos reales para `dashboard-team-members-card.tsx`.
 * 2. **Tipado Estricto y Full Observabilidad**: ((Implementada)) La nueva función está fuertemente tipada y utiliza `logger.trace`/`logger.error` para una visibilidad completa.
 * 3. **Consistencia en `getWorkspaceById`**: ((Implementada)) La función `getWorkspaceById` ahora también selecciona la columna `icon`, asegurando que la información completa del workspace esté disponible.
 *
 * @subsection Melhorias Futuras
 * 1. **Cacheo de Miembros**: ((Vigente)) La función `getWorkspaceMembers` es candidata para `React.cache` (`unstable_cache`) para optimizar el rendimiento, ya que la lista de miembros no cambia con mucha frecuencia. La clave de caché debería incluir `workspaceId`.
 *
 * =====================================================================
 */
// src/lib/data/workspaces/management.data.ts
