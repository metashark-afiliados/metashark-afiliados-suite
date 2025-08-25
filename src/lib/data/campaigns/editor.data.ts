/**
 * @file src/lib/data/campaigns/editor.data.ts
 * @description Aparato de datos atómico. Obtiene el contenido de una campaña para el editor.
 *              Ha sido refactorizado a un estándar de élite para alinearse con la SSoT de
 *              boilerplate (`BOILERPLATE_CREATION_ID`) y para incluir una capa de
 *              adaptación que transforma los datos simulados al contrato esperado por la UI.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";

import { unstable_cache as cache } from "next/cache";

import { hasWorkspacePermission } from "@/lib/data/permissions";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Json } from "@/lib/types/database";
// --- INICIO DE CORRECCIÓN DE NOMENCLATURA (TS2724) ---
import {
  BOILERPLATE_CREATION_ID,
  getBoilerplateCreation,
} from "@/lib/builder/boilerplate";
// --- FIN DE CORRECCIÓN DE NOMENCLATURA (TS2724) ---

import { type CampaignWithContent } from "./types";

export async function getCampaignContentById(
  creationId: string, // Semánticamente es un ID de creación
  userId: string
): Promise<CampaignWithContent | null> {
  // --- INICIO DE CORRECCIÓN DE LÓGICA (TS2724) Y ADAPTACIÓN DE DATOS ---
  if (
    process.env.DEV_MODE_BOILERPLATE_CREATION === "true" &&
    creationId === BOILERPLATE_CREATION_ID
  ) {
    logger.warn(
      `[DataLayer:Editor] MODO BOILERPLATE ACTIVO. Devolviendo 'Creation' estática para ID: ${creationId}`
    );
    const boilerplateCreation = getBoilerplateCreation();

    // Capa de Adaptación: Transforma la `Creation` al formato `CampaignWithContent`
    // que la UI espera, simulando un join con `sites`.
    return {
      id: boilerplateCreation.id,
      creation_id: boilerplateCreation.id, // En un caso real, esto sería diferente
      site_id: "dev-site-001", // ID de sitio simulado
      name: boilerplateCreation.name,
      slug: "boilerplate-slug",
      status: "draft",
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
  // --- FIN DE CORRECCIÓN ---

  const cacheKey = `campaign-editor-${creationId}-${userId}`;
  const cacheTags = [`creation:${creationId}`, `user:${userId}:editor-content`];

  return cache(
    async (id: string, user_id: string) => {
      logger.info(
        `[Cache MISS] Cargando contenido de creación para editor: ${id} por usuario ${user_id}`
      );
      const supabase = createClient();
      const { data: campaign, error } = await supabase
        .from("campaigns") // A futuro, la consulta primaria será en `creations`
        .select(`*, sites (workspace_id, subdomain)`)
        .eq("id", id) // A futuro, será `creation_id`
        .single();

      if (error || !campaign) {
        if (error && error.code !== "PGRST116") {
          logger.error(`Error al obtener la campaña/creación ${id}:`, error);
        }
        return null;
      }

      // La lógica de permisos se mantendrá y evolucionará
      const workspaceId = campaign.sites?.workspace_id;
      if (!workspaceId) {
        // Lógica para creaciones/campañas "huérfanas"
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Errores de Compilación (TS2724)**: ((Implementada)) Se han corregido las importaciones y las llamadas a la SSoT de boilerplate, resolviendo los dos errores de tipo.
 * 2. **Capa de Adaptación (Adapter Pattern)**: ((Implementada)) Se ha introducido una capa de adaptación que transforma el objeto `Creation` simulado al contrato `CampaignWithContent` esperado por la UI. Esta es una implementación de élite que previene la propagación de inconsistencias de tipo a las capas superiores.
 * 3. **Alineación Semántica**: ((Implementada)) El parámetro de la función ha sido renombrado a `creationId` para una mayor coherencia arquitectónica.
 *
 * @subsection Melhorias Futuras
 * 1. **Migración a `creations`**: ((Vigente)) La consulta principal de la base de datos (fuera del modo boilerplate) todavía apunta a la tabla `campaigns`. La refactorización final de este aparato implicará cambiar esta consulta para que obtenga los datos directamente de la tabla `creations`.
 *
 * =====================================================================
 */
