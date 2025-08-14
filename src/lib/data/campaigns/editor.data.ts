// src/lib/data/campaigns/editor.data.ts
/**
 * @file src/lib/data/campaigns/editor.data.ts
 * @description Aparato de datos atómico. Su única responsabilidad es obtener
 *              el contenido completo de una campaña para el editor (`/builder`).
 *              Ahora incluye cacheo con `unstable_cache` para optimizar el rendimiento.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use server";

import { unstable_cache as cache } from "next/cache"; // Import unstable_cache
import { hasWorkspacePermission } from "@/lib/data/permissions";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";

import { type CampaignWithContent } from "./types";

export async function getCampaignContentById(
  campaignId: string,
  userId: string // userId is part of the cache key
): Promise<CampaignWithContent | null> {
  const cacheKey = `campaign-editor-${campaignId}-${userId}`; // Unique cache key per campaign and user
  const cacheTags = [
    `campaign:${campaignId}`,
    `user:${userId}:editor-campaigns`,
  ]; // Tags for revalidation

  return cache(
    async (id: string, user_id: string) => {
      // arguments passed to the cached function
      logger.info(
        `[Cache MISS] Cargando contenido de campaña para editor: ${id} por usuario ${user_id}`
      );
      const supabase = createClient();
      const { data: campaign, error } = await supabase
        .from("campaigns")
        .select(`*, sites (workspace_id, subdomain)`)
        .eq("id", id)
        .single();

      if (error || !campaign) {
        if (error && error.code !== "PGRST116") {
          logger.error(`Error al obtener la campaña ${id}:`, error);
        }
        return null;
      }

      const workspaceId = campaign.sites?.workspace_id;
      if (!workspaceId) {
        logger.error(`INCONSISTENCIA: Campaña ${id} sin workspace asociado.`);
        return null;
      }

      const isAuthorized = await hasWorkspacePermission(user_id, workspaceId, [
        "owner",
        "admin",
        "member",
      ]);

      if (!isAuthorized) {
        logger.warn(
          `SEGURIDAD: Usuario ${user_id} intentó acceder a la campaña ${id} sin permisos.`
        );
        return null;
      }
      logger.trace(
        `[CampaignEditorData] Contenido de campaña ${id} cargado exitosamente para el editor.`
      );
      return campaign as CampaignWithContent;
    },
    [cacheKey], // Dependencies for the cache key generation (should be stable)
    { tags: cacheTags } // Tags for invalidation
  )(campaignId, userId); // Call the cached function with the actual arguments
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cacheo de Datos de Campaña**: ((Implementada)) La función `getCampaignContentById` ahora utiliza `unstable_cache` de Next.js para memoizar los resultados por `campaignId` y `userId`. Esto mejora el rendimiento del constructor al reducir las consultas redundantes a la base de datos para la misma campaña y usuario dentro de la misma request.
 *
 * @subsection Melhorias Futuras
 * 1. **Sistema de Plantillas de Campaña**: ((Vigente)) La estructura de campaña por defecto en `src/app/[locale]/builder/[campaignId]/page.tsx` está codificada. Una mejora arquitectónica sería mover esta y otras plantillas a una tabla `campaign_templates` para una gestión centralizada y dinámica.
 *
 * =====================================================================
 */
