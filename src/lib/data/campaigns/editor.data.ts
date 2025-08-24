// src/lib/data/campaigns/editor.data.ts
/**
 * @file src/lib/data/campaigns/editor.data.ts
 * @description Aparato de datos atómico. Obtiene el contenido de una campaña.
 *              Corregido para invocar el nombre de función correcto del boilerplate.
 * @author Raz Podestá
 * @version 3.1.0
 */
"use server";

import { unstable_cache as cache } from "next/cache";

import { hasWorkspacePermission } from "@/lib/data/permissions";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import {
  BOILERPLATE_CAMPAIGN_ID,
  getBoilerplateCampaign, // <-- CORRECCIÓN
} from "@/lib/builder/boilerplate";

import { type CampaignWithContent } from "./types";

export async function getCampaignContentById(
  campaignId: string,
  userId: string
): Promise<CampaignWithContent | null> {
  if (
    process.env.DEV_MODE_BOILERPLATE_CAMPAIGN === "true" &&
    campaignId === BOILERPLATE_CAMPAIGN_ID
  ) {
    logger.warn(
      `[DataLayer:Editor] MODO BOILERPLATE ACTIVO. Devolviendo configuración estática para campaignId: ${campaignId}`
    );
    return getBoilerplateCampaign(); // <-- CORRECCIÓN
  }

  const cacheKey = `campaign-editor-${campaignId}-${userId}`;
  const cacheTags = [
    `campaign:${campaignId}`,
    `user:${userId}:editor-campaigns`,
  ];

  return cache(
    async (id: string, user_id: string) => {
      logger.info(
        `[Cache MISS] Cargando contenido de campaña para editor: ${id} por usuario ${user_id}`
      );
      // ... resto de la función sin cambios
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
        if (campaign.created_by === user_id) {
          logger.trace(
            `[CampaignEditorData] Acceso concedido a campaña huérfana ${id}.`
          );
          return campaign as CampaignWithContent;
        } else {
          logger.warn(
            `SEGURIDAD: Usuario ${user_id} intentó acceder a campaña huérfana ${id} de otro usuario.`
          );
          return null;
        }
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
    [cacheKey],
    { tags: cacheTags }
  )(campaignId, userId);
}
// src/lib/data/campaigns/editor.data.ts
