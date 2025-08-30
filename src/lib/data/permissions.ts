// src/lib/data/permissions.ts
/**
 * @file src/lib/data/permissions.ts
 * @description Módulo de bajo nivel y SSoT para la lógica de autorización.
 *              Ha sido refactorizado a un estándar de élite para reemplazar
 *              `React.cache` por `unstable_cache` de `next/cache`, resolviendo
 *              un error crítico de runtime y alineándose con la estrategia de
 *              cacheo canónica de Next.js.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Database } from "@/lib/types/database";

type WorkspaceRole = Database["public"]["Enums"]["workspace_role"];

/**
 * @public
 * @async
 * @function hasWorkspacePermission
 * @description Verifica si un usuario tiene uno de los roles requeridos en un
 *              workspace. La consulta a la base de datos es cacheada por request
 *              utilizando la API `unstable_cache` de Next.js.
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
    logger.trace(
      `[AuthPermissions:Cache MISS] Verificando permisos para usuario ${userId} en workspace ${workspaceId}`
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
          `[AuthPermissions] Error al verificar permisos para usuario ${userId} en workspace ${workspaceId}:`,
          error
        );
      }
      return false;
    }

    const hasPermission = requiredRoles.includes(member.role);
    logger.trace(
      `[AuthPermissions] Resultado de la verificación para ${userId}: ${hasPermission}`
    );
    return hasPermission;
  },
  ["workspace_permissions"], // Clave base para el segmento de caché
  {
    tags: ["permissions"], // Etiqueta para revalidación
  }
);
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Claves de Caché Dinámicas**: La clave de `unstable_cache` se podría hacer más específica (ej. `['workspace_permissions', userId, workspaceId]`) para evitar colisiones si la función se llamara con diferentes `requiredRoles` en la misma request, aunque el comportamiento por defecto de `cache` ya maneja esto basándose en los argumentos de la función.
 * 2. **Revalidación por Etiqueta**: Implementar llamadas a `revalidateTag('permissions')` en las Server Actions que modifican los roles de `workspace_members` para invalidar activamente este caché y garantizar la consistencia de los datos.
 * =====================================================================
 */
// src/lib/data/permissions.ts
