/**
 * @file campaign-payload.helper.ts
 * @description Aparato helper atómico y puro. Su única responsabilidad es actuar
 *              como una factoría para generar payloads de datos para nuevas campañas.
 *              Validado y alineado con el contrato de datos de `campaigns` v5.0.0.
 * @author L.I.A. Legacy & Raz Podestá
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import "server-only";

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
  creationId,
}: {
  userId: string;
  campaignType: string;
  siteId?: string;
  creationId: string;
}): TablesInsert<"campaigns"> {
  const name = `Nueva Campaña (${campaignType})`;
  const slug = `${slugify(campaignType)}-${Date.now()}`;

  return {
    name,
    slug,
    site_id: siteId || null,
    creation_id: creationId,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Tipo (TS2322)**: ((Implementada)) La refactorización del contrato de tipo en `campaigns.ts` para permitir `site_id: string | null` resuelve el error de compilación que ocurría en este aparato.
 * 2. **Alineación Arquitectónica**: ((Implementada)) Se ha añadido el parámetro `creation_id`, asegurando que cada nueva campaña esté correctamente vinculada a su `Creation` soberana.
 *
 * @subsection Melhorias Futuras
 * 1. **Contenido Inicial Basado en Plantilla**: ((Vigente)) La función podría ser extendida para aceptar un `templateId` y poblar el campo `content` inicial basándose en una plantilla, en lugar de estar vacío por defecto.
 *
 * =====================================================================
 */
