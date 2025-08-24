// src/lib/actions/builder.actions.ts
/**
 * @file src/lib/actions/builder.actions.ts
 * @description Server Action para actualizar el contenido de una campaña.
 *              Incluye un interruptor de modo de desarrollo para simular el
 *              guardado sin interactuar con la base de datos.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import { type CampaignConfig } from "@/lib/builder/types.d";
import { campaignsData } from "@/lib/data";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Json } from "@/lib/types/database";
import { type ActionResult } from "@/lib/validators";
import { BOILERPLATE_CAMPAIGN_ID } from "@/lib/builder/boilerplate";

import { createAuditLog } from "./_helpers";

/**
 * @public
 * @async
 * @function updateCampaignContentAction
 * @description Actualiza el campo `content` de una campaña en la base de datos.
 * @param {string} campaignId - El ID de la campaña a actualizar.
 * @param {CampaignConfig} content - El nuevo objeto de configuración de la campaña.
 * @returns {Promise<ActionResult<void>>}
 */
export async function updateCampaignContentAction(
  campaignId: string,
  content: CampaignConfig
): Promise<ActionResult<void>> {
  // --- INTERRUPTOR DE MODO BOILERPLATE ---
  if (
    process.env.DEV_MODE_BOILERPLATE_CAMPAIGN === "true" &&
    campaignId === BOILERPLATE_CAMPAIGN_ID
  ) {
    logger.warn(
      `[BuilderActions] MODO BOILERPLATE ACTIVO. Omitiendo guardado en DB para campaignId: ${campaignId}`
    );
    // Simula un pequeño retraso para probar la UI de carga
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, data: undefined };
  }
  // --- FIN DEL INTERRUPTOR ---

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "No autenticado." };
  }

  const campaignData = await campaignsData.editor.getCampaignContentById(
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
 * 1. **Simulación de Persistencia**: ((Implementada)) La acción ahora intercepta las llamadas de guardado para la campaña de boilerplate, completando el aislamiento del flujo de desarrollo.
 * 2. **Simulación de Latencia**: ((Implementada)) Se ha añadido un retraso artificial en el modo boilerplate para permitir probar y visualizar los estados de carga en la UI.
 *
 * @subsection Melhorias Futuras
 * 1. **Persistencia en `localStorage`**: ((Vigente)) En el bloque del modo boilerplate, se podría simular el guardado escribiendo el objeto `content` en el `localStorage` del navegador.
 *
 * =====================================================================
 */
// src/lib/actions/builder.actions.ts
