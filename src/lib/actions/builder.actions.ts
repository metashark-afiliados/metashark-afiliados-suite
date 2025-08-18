// src/lib/actions/builder.actions.ts
/**
 * @file src/lib/actions/builder.actions.ts
 * @description Contiene las Server Actions específicas del constructor de campañas.
 *              Ha sido corregido para consumir la capa de datos de campañas
 *              a través de su namespace canónico `campaignsData`.
 * @author Raz Podestá
 * @version 1.1.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import { type CampaignConfig } from "@/lib/builder/types.d";
import { campaignsData } from "@/lib/data"; // <-- CORRECCIÓN DE IMPORTACIÓN
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Json } from "@/lib/types/database";
import { type ActionResult } from "@/lib/validators";

import { createAuditLog } from "./_helpers";

export async function updateCampaignContentAction(
  campaignId: string,
  content: CampaignConfig
): Promise<ActionResult<void>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "No autenticado." };
  }

  const campaignData = await campaignsData.editor.getCampaignContentById(
    // <-- CORRECCIÓN DE CONSUMO
    campaignId,
    user.id
  );

  if (!campaignData) {
    logger.warn(
      `[SEGURIDAD] VIOLACIÓN DE ACCESO: Usuario ${user.id} intentó guardar la campaña ${campaignId} sin permisos.`
    );
    return {
      success: false,
      error: "Acceso denegado. No tienes permiso para editar esta campaña.",
    };
  }

  logger.trace(
    `[BuilderActions] Usuario ${user.id} autorizado para guardar la campaña ${campaignId}.`
  );

  const { error } = await supabase
    .from("campaigns")
    .update({
      content: content as unknown as Json,
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId);

  if (error) {
    logger.error(
      `[BuilderActions] Error al guardar campaña ${campaignId}:`,
      error
    );
    return { success: false, error: "No se pudo guardar la campaña." };
  }

  await createAuditLog("campaign_content_updated", {
    userId: user.id,
    targetEntityId: campaignId,
    targetEntityType: "campaign",
    metadata: { campaignName: content.name },
  });

  const { slug } = campaignData;
  const subdomain = campaignData.sites?.subdomain;

  if (subdomain && slug) {
    const path = `/s/${subdomain}/${slug}`;
    revalidatePath(path);
    logger.info(`[BuilderActions] Revalidated path for ISR: ${path}`);
  } else {
    logger.warn(
      `[BuilderActions] No se pudo revalidar la ruta. Faltan datos para la campaña ${campaignId}.`,
      { subdomain, slug }
    );
  }

  return { success: true, data: undefined };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Capa de Datos**: ((Implementada)) La importación ahora consume el namespace `campaignsData` desde el barrel file de la capa de datos y se utiliza `campaignsData.editor`, resolviendo el error de compilación TS2305 y alineando la action con la arquitectura de datos canónica.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Contenido con Zod**: ((Vigente)) Antes de guardar, el objeto `content` debe ser validado contra un `CampaignConfigSchema` de Zod.
 *
 * =====================================================================
 */
// src/lib/actions/builder.actions.ts
