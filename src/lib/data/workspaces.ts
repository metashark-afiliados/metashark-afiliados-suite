/**
 * @file src/lib/data/workspaces.ts
 * @description Aparato de datos para la entidad 'workspaces'. Esta es la Única Fuente
 *              de Verdad para interactuar con la tabla `workspaces`. Ha sido
 *              nivelado a un estándar de élite para incluir la obtención de datos
 *              por ID, una gestión de errores resiliente y soporte para
 *              inyección de dependencias.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use server";

import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

export type Workspace = Tables<"workspaces">;
type Supabase = SupabaseClient<any, "public", any>;

/**
 * @public
 * @async
 * @function getWorkspacesByUserId
 * @description Obtiene todos los workspaces a los que un usuario pertenece.
 * @param {string} userId - El ID del usuario.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase.
 * @returns {Promise<Workspace[]>} Una promesa que resuelve a un array de workspaces.
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
 * @function getFirstWorkspaceForUser
 * @description Obtiene el primer workspace de un usuario, útil para el flujo de onboarding.
 * @param {string} userId - El ID del usuario.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase.
 * @returns {Promise<Workspace | null>} El primer workspace o null.
 */
export async function getFirstWorkspaceForUser(
  userId: string,
  supabaseClient?: Supabase
): Promise<Workspace | null> {
  const supabase = supabaseClient || createServerClient();
  try {
    const { data, error } = await supabase
      .from("workspace_members")
      .select("workspaces(*)")
      .eq("user_id", userId)
      .limit(1)
      .single();

    if (error) {
      if (error.code !== "PGRST116") {
        throw new Error("No se pudo cargar el workspace inicial del usuario.");
      }
      return null;
    }

    if (!data?.workspaces) {
      return null;
    }
    const workspaceData = data.workspaces;
    return Array.isArray(workspaceData) ? null : workspaceData;
  } catch (error) {
    logger.error(`Error al obtener el primer workspace para ${userId}:`, error);
    return null;
  }
}

/**
 * @public
 * @async
 * @function getWorkspaceById
 * @description Obtiene la información básica de un workspace por su ID.
 * @param {string} workspaceId - El ID del workspace.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase.
 * @returns {Promise<Pick<Workspace, "id" | "name"> | null>} Información del workspace o null.
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
 * 1. **Enriquecimiento de Contexto**: ((Implementada)) Se ha añadido la función `getWorkspaceById`, que es un prerrequisito para implementar la mejora de "Contexto de Breadcrumbs Enriquecido" en el `CampaignsPageLoader`.
 * 2. **Cero Regresiones**: ((Implementada)) Se ha preservado la funcionalidad original de `getWorkspacesByUserId` y `getFirstWorkspaceForUser`.
 *
 * @subsection Melhorias Futuras
 * 1. **Cacheo con `React.cache`**: ((Vigente)) Todas las funciones de lectura en este archivo son candidatas ideales para ser envueltas en `React.cache` para optimizar el rendimiento en Server Components.
 *
 * =====================================================================
 */
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Cacheo con `React.cache`**: ((Vigente)) Las funciones de esta capa de datos, especialmente `getWorkspacesByUserId`, son candidatas ideales para ser envueltas en `React.cache` para optimizar el rendimiento en Server Components, evitando consultas repetidas a la base de datos dentro del mismo ciclo de renderizado.
 * 2. **Función `getWorkspaceDetails`**: ((Vigente)) Añadir una nueva función que obtenga los detalles de un workspace junto con la lista de sus miembros y sus roles.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Gestión de Errores Resiliente**: ((Implementada)) Ambas funciones ahora utilizan bloques `try/catch` para capturar excepciones, registrar el error con contexto y devolver un valor seguro (`[]` o `null`), haciendo que la UI sea más robusta ante fallos de la base de datos.
 * 2. **Resiliencia a Inconsistencias de Datos**: ((Implementada)) La lógica ha sido fortalecida para manejar casos de borde donde las relaciones en la base de datos podrían estar inconsistentes (ej. un `workspace_member` sin un `workspace` asociado), previniendo errores en tiempo de ejecución.
 * 3. **Inyección de Dependencias para Pruebas**: ((Implementada)) Ambas funciones aceptan un cliente de Supabase opcional, lo que las hace 100% testeables de forma unitaria y desacopladas del entorno de ejecución.
 *
 * =====================================================================
 */
// src/lib/data/workspaces.ts
