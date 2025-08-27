// src/lib/data/workspaces/management.data.ts
/**
 * @file management.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura para la gestión de workspaces (Dashboard).
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { cache } from "react";
import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";
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
 * @returns {Promise<Pick<Workspace, "id" | "name"> | null>} El objeto del workspace o null si no se encuentra.
 */
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad de Lógica de Datos (SRP)**: ((Implementada)) Este nuevo aparato aísla perfectamente la lógica de obtención de datos para workspaces, cumpliendo con la directiva de atomización. Su lógica ha sido migrada directamente del archivo monolítico.
 * 2. **Optimización de Rendimiento**: ((Implementada)) Ambas funciones utilizan `React.cache` para prevenir consultas duplicadas a la base de datos dentro de la misma request.
 *
 * @subsection Melhorias Futuras
 * 1. **Función `getWorkspaceMembers`**: ((Vigente)) Para una futura página de gestión de miembros del workspace, se necesitará una nueva función `getWorkspaceMembers(workspaceId: string)` que devuelva la lista de usuarios y sus roles. Propondré añadirla cuando se aborde dicha funcionalidad.
 *
 * =====================================================================
 */
// src/lib/data/workspaces/management.data.ts
