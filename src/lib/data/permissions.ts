// src/lib/data/permissions.ts
/**
 * @file src/lib/data/permissions.ts
 * @description Módulo de bajo nivel para la lógica de autorización. Ha sido
 *              nivelado a un estándar de élite al envolver la consulta de permisos
 *              en `React.cache` para una optimización de rendimiento crítica.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
"use server";
import "server-only";

import { cache } from "react";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Database } from "@/lib/types/database";

type WorkspaceRole = Database["public"]["Enums"]["workspace_role"];

/**
 * @public
 * @async
 * @function hasWorkspacePermission
 * @description Verifica si un usuario tiene uno de los roles requeridos en un
 *              workspace. La consulta a la base de datos es cacheada por request.
 * @param {string} userId - El UUID del usuario a verificar.
 * @param {string} workspaceId - El UUID del workspace.
 * @param {WorkspaceRole[]} requiredRoles - Array de roles que otorgan el permiso.
 * @returns {Promise<boolean>} Devuelve `true` si el usuario tiene el permiso.
 */
export const hasWorkspacePermission = cache(
  async (
    userId: string,
    workspaceId: string,
    requiredRoles: WorkspaceRole[]
  ): Promise<boolean> => {
    const cacheKey = `perm:${userId}:${workspaceId}`;
    logger.trace(
      `[AuthPermissions] Verificando permisos (Cache Key: ${cacheKey})`
    );

    const supabase = createClient();
    const { data: member, error } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("user_id", userId)
      .eq("workspace_id", workspaceId)
      .single();

    if (error || !member) {
      if (error && error.code !== "PGRST116") {
        logger.error(
          `[AuthPermissions] Error al verificar permisos para ${cacheKey}:`,
          error
        );
      }
      return false;
    }

    const hasPermission = requiredRoles.includes(member.role);
    logger.trace(
      `[AuthPermissions] Resultado de la verificación para ${cacheKey}: ${hasPermission}`
    );
    return hasPermission;
  }
);
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cacheo de Permisos de Élite**: ((Implementada)) La función ahora está envuelta en `React.cache`. Las llamadas subsecuentes con el mismo `userId` y `workspaceId` dentro de la misma request no golpearán la base de datos, optimizando drásticamente el rendimiento de los guardianes de seguridad.
 * 2. **Observabilidad Mejorada**: ((Implementada)) Se han añadido logs de `trace` que incluyen la clave de caché y el resultado de la verificación, proporcionando una visibilidad clara sobre el comportamiento del caché.
 *
 * @subsection Melhorias Futuras
 * 1. **Permisos a Nivel de Aplicación**: ((Vigente)) Crear una función similar `hasAppPermission(userId, requiredRoles)` que verifique el `app_role` en `profiles` y también esté cacheada.
 *
 * =====================================================================
 */
// src/lib/data/permissions.ts
