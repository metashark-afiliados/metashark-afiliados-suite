// src/lib/actions/campaigns/create.action.ts
/**
 * @file create.action.ts
 * @description Server Action atómica para crear una nueva campaña. Ha sido
 *              refactorizada para consumir la nueva API de datos atomizada,
 *              resolviendo el error de compilación TS2339.
 * @author Raz Podestá
 * @version 2.0.0
 * @date 2025-08-27
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { hasWorkspacePermission } from "@/lib/data/permissions";
// --- INICIO DE CORRECCIÓN ARQUITECTÓNICA ---
// Se importa el módulo 'sites' completo, que ahora contiene los namespaces.
import { sites as sitesData } from "@/lib/data";
// --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, CreateCampaignSchema } from "@/lib/validators";
import { createAuditLog, getAuthenticatedUser } from "../_helpers";

export async function createCampaignAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const rawData = Object.fromEntries(formData);
    const { name, slug, site_id } = CreateCampaignSchema.parse(rawData);

    // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA ---
    // La llamada ahora utiliza la API namespaced correcta: `sitesData.management.getSiteById`.
    const site = await sitesData.management.getSiteById(site_id);
    // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
    if (!site) {
      return { success: false, error: "error_site_not_found" };
    }

    const isAuthorized = await hasWorkspacePermission(
      user.id,
      site.workspace_id,
      ["owner", "admin", "member"]
    );

    if (!isAuthorized) {
      return { success: false, error: "error_permission_denied" };
    }

    const supabase = createClient();
    const { data: newCampaign, error } = await supabase
      .from("campaigns")
      .insert({ name, slug, site_id, content: {}, created_by: user.id })
      .select("id")
      .single();

    if (error) {
      logger.error("Error al crear la campaña en DB:", error);
      return { success: false, error: "error_creation_failed" };
    }

    await createAuditLog("campaign.created", {
      userId: user.id,
      targetEntityId: newCampaign.id,
      metadata: { name, siteId: site_id },
    });

    revalidatePath(`/dashboard/sites/${site_id}/campaigns`);
    return { success: true, data: { id: newCampaign.id } };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: "error_invalid_data" };
    }
    logger.error("Error inesperado en createCampaignAction:", error);
    return { success: false, error: "error_unexpected" };
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Resolución de Error de Compilación (TS2339)**: Se ha actualizado la llamada a la capa de datos para usar `sitesData.management.getSiteById`, alineando la acción con la nueva arquitectura de datos atomizada.
 * 2. ((Implementada)) **Consistencia Arquitectónica**: Esta corrección propaga la nueva arquitectura de datos a la capa de acciones, reforzando la estructura modular del backend.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Transacción RPC**: La creación de la campaña y la actualización del `current_site_count` en la tabla `sites` deberían ser una única operación atómica a través de una función RPC en PostgreSQL para garantizar la integridad de los datos.
 *
 * =====================================================================
 */
// src/lib/actions/campaigns/create.action.ts
