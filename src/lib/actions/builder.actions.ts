/**
 * @file src/lib/actions/builder.actions.ts
 * @description Server Action para actualizar el contenido de una `Creation`.
 *              Ha sido refactorizada a un estándar de élite para alinearse con la
 *              arquitectura de "Creaciones Soberanas", utilizando la nomenclatura
 *              y las SSoT correctas para el "Modo Boilerplate".
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import { createAuditLog } from "@/lib/actions/_helpers";
// --- INICIO DE CORRECCIÓN DE NOMENCLATURA (TS2724) ---
import { BOILERPLATE_CREATION_ID } from "@/lib/builder/boilerplate";
// --- FIN DE CORRECCIÓN DE NOMENCLATURA (TS2724) ---
import { type CampaignConfig } from "@/lib/builder/types.d";
import { campaignsData } from "@/lib/data";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Json } from "@/lib/types/database";
import { type ActionResult } from "@/lib/validators";

/**
 * @public
 * @async
 * @function updateCampaignContentAction
 * @description Actualiza el campo `content` de una `Creation` en la base de datos.
 * @param {string} creationId - El ID de la `Creation` a actualizar.
 * @param {CampaignConfig} content - El nuevo objeto de configuración del diseño.
 * @returns {Promise<ActionResult<void>>}
 */
export async function updateCampaignContentAction(
  creationId: string,
  content: CampaignConfig
): Promise<ActionResult<void>> {
  // --- INICIO DE CORRECCIÓN DE LÓGICA (TS2724) ---
  if (
    process.env.DEV_MODE_BOILERPLATE_CREATION === "true" &&
    creationId === BOILERPLATE_CREATION_ID
  ) {
    logger.warn(
      `[BuilderActions] MODO BOILERPLATE ACTIVO. Omitiendo guardado en DB para creationId: ${creationId}`
    );
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, data: undefined };
  }
  // --- FIN DE CORRECCIÓN DE LÓGICA (TS2724) ---

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "No autenticado." };
  }

  // A futuro, esto validará contra la tabla `creations`, no `campaigns`.
  const campaignData = await campaignsData.editor.getCampaignContentById(
    creationId,
    user.id
  );

  if (!campaignData) {
    logger.warn(
      `[SEGURIDAD] VIOLACIÓN DE ACCESO: Usuario ${user.id} intentó guardar la creación ${creationId} sin permisos.`
    );
    return {
      success: false,
      error: "Acceso denegado. No tienes permiso para editar este diseño.",
    };
  }

  const { error } = await supabase
    .from("creations") // Objetivo de la mutación es `creations`
    .update({
      content: content as unknown as Json,
      updated_at: new Date().toISOString(),
    })
    .eq("id", creationId);

  if (error) {
    logger.error(
      `[BuilderActions] Error al guardar creación ${creationId}:`,
      error
    );
    return { success: false, error: "No se pudo guardar el diseño." };
  }

  await createAuditLog("creation.content_updated", {
    userId: user.id,
    targetEntityId: creationId,
    metadata: { creationName: content.name },
  });

  revalidatePath(`/builder/${creationId}`);
  // Si la creación está vinculada a campañas, revalidarlas también
  if (campaignData.sites?.subdomain && campaignData.slug) {
    revalidatePath(`/s/${campaignData.sites.subdomain}/${campaignData.slug}`);
  }

  return { success: true, data: undefined };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Nomenclatura (TS2724)**: ((Implementada)) Se ha corregido la constante importada y utilizada, resolviendo el error de compilación y alineando la acción con la arquitectura de "Creations".
 * 2. **Alineación Semántica**: ((Implementada)) El parámetro `campaignId` ha sido renombrado a `creationId` para una consistencia de élite en toda la base de código. La lógica de mutación ahora apunta a la tabla `creations`.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Permisos en `creations`**: ((Vigente)) La lógica de validación de permisos (`getCampaignContentById`) aún apunta a la entidad `campaigns`. Debe ser refactorizada para consultar la tabla `creations` y validar la propiedad del usuario sobre el diseño.
 *
 * =====================================================================
 */
