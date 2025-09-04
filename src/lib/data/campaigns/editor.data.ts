// src/lib/data/campaigns/editor.data.ts
/**
 * @file src/lib/data/campaigns/editor.data.ts
 * @description Aparato de datos atómico para obtener el contenido de un diseño para el editor.
 *              ADVERTENCIA: Este módulo contiene deuda técnica. Su consulta principal
 *              debe migrar de la tabla `campaigns` a `creations` para alinearse
 *              plenamente con la arquitectura de "Diseño Soberano".
 * @author L.I.A. Legacy
 * @version 5.0.0
 * @see .docs-espejo/lib/data/campaigns/editor.data.ts.md
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";

import {
  BOILERPLATE_CREATION_ID,
  getBoilerplateCreation,
} from "@/lib/builder/boilerplate";
import { hasWorkspacePermission } from "@/lib/data/permissions";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

import { type CampaignWithContent } from "./types";

/**
 * @public
 * @async
 * @function getCampaignContentById
 * @description Obtiene el contenido completo de un diseño (`Creation`) para ser
 *              utilizado en el editor del constructor, validando los permisos del usuario.
 * @param {string} creationId - El ID del diseño (`Creation`) a obtener.
 * @param {string} userId - El ID del usuario que solicita el acceso.
 * @returns {Promise<CampaignWithContent | null>} Un objeto con el contenido completo
 *          del diseño o `null` si no se encuentra o el usuario no tiene permisos.
 */
export async function getCampaignContentById(
  creationId: string,
  userId: string
): Promise<CampaignWithContent | null> {
  // Lógica de modo de desarrollo para desarrollo de UI aislado.
  if (
    process.env.DEV_MODE_BOILERPLATE_CREATION === "true" &&
    creationId === BOILERPLATE_CREATION_ID
  ) {
    logger.warn(
      { creationId },
      "[DataLayer:Editor] MODO BOILERPLATE ACTIVO. Devolviendo 'Creation' estática."
    );
    const boilerplateCreation = getBoilerplateCreation();

    // Capa de Adaptación: Transforma la `Creation` al formato `CampaignWithContent`
    // que la UI espera actualmente, simulando un join con `sites`.
    return {
      id: boilerplateCreation.id,
      creation_id: boilerplateCreation.id,
      site_id: "dev-site-001",
      name: boilerplateCreation.name,
      slug: "boilerplate-slug",
      status_id: 1, // draft
      content: boilerplateCreation.content,
      affiliate_url: null,
      created_by: boilerplateCreation.created_by,
      created_at: boilerplateCreation.created_at,
      updated_at: boilerplateCreation.updated_at,
      sites: {
        workspace_id: boilerplateCreation.workspace_id,
        subdomain: "boilerplate",
      },
    } as unknown as CampaignWithContent; // Aserción de tipo necesaria para el mock
  }

  const cacheKey = `creation-editor-${creationId}-${userId}`;
  const cacheTags = [`creation:${creationId}`, `user:${userId}:editor-content`];

  return cache(
    async (id: string, user_id: string) => {
      const context = { creationId: id, userId: user_id };
      logger.info(context, "[Cache MISS] Cargando contenido de creación.");
      const supabase = createClient();
      // DEUDA: Esta consulta debe migrar a la tabla `creations`.
      const { data: campaign, error } = await supabase
        .from("campaigns")
        .select(`*, sites (workspace_id, subdomain)`)
        .eq("creation_id", id) // Buscando por creation_id
        .single();

      if (error || !campaign) {
        if (error && error.code !== "PGRST116") {
          logger.error(
            { err: error, ...context },
            `Error al obtener la creación.`
          );
        }
        return null;
      }

      const workspaceId = campaign.sites?.workspace_id;
      if (!workspaceId) {
        // Lógica para creaciones "huérfanas" (no asignadas a un sitio)
        // @ts-ignore - created_by no está en el tipo `campaigns` actual
        if (campaign.created_by === user_id) {
          return campaign as CampaignWithContent;
        }
        return null;
      }

      const isAuthorized = await hasWorkspacePermission(user_id, workspaceId, [
        "owner",
        "admin",
        "member",
      ]);

      if (!isAuthorized) {
        return null;
      }
      return campaign as CampaignWithContent;
    },
    [cacheKey],
    { tags: cacheTags }
  )(creationId, userId);
}
// src/lib/data/campaigns/editor.data.ts
