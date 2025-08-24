// src/lib/actions/campaigns/create-from-template.action.ts
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import { requireSitePermission } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult } from "@/lib/validators";

import {
  createAuditLog,
  createPersistentErrorLog,
  getAuthenticatedUser,
} from "../_helpers";

/**
 * @public
 * @async
 * @function createCampaignFromTemplateAction
 * @description [Arquitectura v12.0] Crea una campaña a partir de un tipo de plantilla.
 *              El `siteId` es opcional. Si no se provee, la campaña se crea en un
 *              estado "huérfano" (no asignado), permitiendo su creación soberana.
 * @param {string} campaignType - El tipo de campaña a crear (ej. "landing").
 * @param {string} [siteId] - El ID opcional del sitio al que se asignará.
 * @returns {Promise<ActionResult<{ id: string }>>} El resultado de la operación.
 */
export async function createCampaignFromTemplateAction(
  campaignType: string,
  siteId?: string
): Promise<ActionResult<{ id: string }>> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  logger.trace("[CreateCampaignAction] Iniciando creación de campaña.", {
    userId: user.id,
    siteId: siteId || "unassigned",
    campaignType,
  });

  try {
    // 1. Verificación de permisos (solo si se provee un siteId)
    if (siteId) {
      const permissionCheck = await requireSitePermission(siteId, [
        "owner",
        "admin",
        "member",
      ]);
      if (!permissionCheck.success) {
        logger.warn(
          `[SEGURIDAD] Usuario ${user.id} sin permisos para crear campaña en sitio ${siteId}.`
        );
        return {
          success: false,
          error: "CampaignsPage.errors.permission_denied",
        };
      }
    }

    // 2. Lógica de creación
    const name = `Nueva Campaña (${campaignType})`;
    const slug = `${campaignType
      .toLowerCase()
      .replace(/\s+/g, "-")}-${Date.now()}`;

    const supabase = createClient();
    const { data: newCampaign, error } = await supabase
      .from("campaigns")
      .insert({
        name,
        slug,
        site_id: siteId || null,
        created_by: user.id,
        content: {
          id: "",
          name,
          site_id: siteId || null,
          theme: { globalFont: "Inter", globalColors: {} },
          blocks: [],
        },
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    // 3. Auditoría y Revalidación
    await createAuditLog("campaign.created_from_template", {
      userId: user.id,
      targetEntityId: newCampaign.id,
      metadata: { name, siteId: siteId || "unassigned", campaignType },
    });

    if (siteId) {
      revalidatePath(`/dashboard/sites/${siteId}/campaigns`);
    }
    revalidatePath("/dashboard", "layout"); // Revalida el dashboard para "Recent Activity"

    logger.info("Campaña creada con éxito y caché revalidada.", {
      campaignId: newCampaign.id,
    });

    return { success: true, data: { id: newCampaign.id } };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "createCampaignFromTemplateAction",
      error as Error,
      { userId: user.id, siteId, campaignType }
    );
    logger.error(
      `Error inesperado en createCampaignFromTemplateAction. Log ID: ${errorId}`
    );
    return { success: false, error: "CampaignsPage.errors.unexpected" };
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Lógica de Creación Soberana**: ((Implementada)) La acción ahora maneja correctamente un `siteId` opcional, permitiendo crear campañas que no están vinculadas a un sitio. Este es el pilar de la nueva arquitectura de "Acceso Directo".
 * 2. **Seguridad Condicional**: ((Implementada)) La verificación de permisos del sitio solo se ejecuta si se proporciona un `siteId`, optimizando la ejecución y adhiriéndose a la lógica de negocio.
 * 3. **Full Observabilidad y Resiliencia**: ((Implementada)) Se ha añadido `try/catch` para errores inesperados con registro persistente, y se han mejorado los logs existentes.
 *
 * @subsection Melhorias Futuras
 * 1. **Plantillas Reales**: ((Vigente)) En lugar de un `content` vacío, esta acción podría leer una estructura de plantilla real desde una tabla `campaign_templates` basada en el `campaignType` para una creación más rica.
 * 2. **Contrato de Error I18n**: ((Implementada)) La acción devuelve claves de i18n para los mensajes de error.
 *
 * =====================================================================
 */
// src/lib/actions/campaigns/create-from-template.action.ts
