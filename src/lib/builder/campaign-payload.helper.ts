// src/lib/builder/campaign-payload.helper.ts
/**
 * @file src/lib/builder/campaign-payload.helper.ts
 * @description Aparato helper atómico y puro. Su única responsabilidad es actuar
 *              como una factoría para generar payloads de datos para nuevas campañas.
 *              No contiene la directiva "use server".
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import "server-only"; // Sigue siendo lógica de servidor, pero no una Server Action.

import { type CampaignConfig } from "@/lib/builder/types.d";
import { type TablesInsert } from "@/lib/types/database";
import { slugify } from "@/lib/utils/text";

/**
 * @public
 * @function generateCampaignPayload
 * @description Función pura que genera el payload de datos para una nueva campaña.
 * @param {object} params - Los parámetros para generar el payload.
 * @returns {TablesInsert<"campaigns">} El payload listo para la inserción.
 */
export function generateCampaignPayload({
  userId,
  campaignType,
  siteId,
}: {
  userId: string;
  campaignType: string;
  siteId?: string;
}): TablesInsert<"campaigns"> {
  const name = `Nueva Campaña (${campaignType})`;
  const slug = `${slugify(campaignType)}-${Date.now()}`;

  const initialContent: Omit<CampaignConfig, "id"> = {
    name,
    site_id: siteId || null,
    theme: { globalFont: "Inter", globalColors: {} },
    blocks: [],
  };

  return {
    name,
    slug,
    site_id: siteId || null,
    created_by: userId,
    content: initialContent,
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Build**: ((Implementada)) Al aislar esta función síncrona en su propio módulo, se resuelve la causa raíz del error de build.
 * 2. **Cohesión Arquitectónica (SRP)**: ((Implementada)) Este aparato ahora tiene una única y clara responsabilidad, mejorando la mantenibilidad.
 *
 * =====================================================================
 */
// src/lib/builder/campaign-payload.helper.ts
