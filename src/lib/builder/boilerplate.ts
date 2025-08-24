// src/lib/builder/boilerplate.ts
/**
 * @file src/lib/builder/boilerplate.ts
 * @description SSoT para los datos de campaña en modo boilerplate.
 *              Refactorizado para devolver un objeto de alta fidelidad que
 *              cumple con el contrato `CampaignWithContent`.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { type Json } from "@/lib/types/database";
import { type CampaignWithContent } from "@/lib/data/campaigns";
import { type CampaignConfig } from "./types.d";

export const BOILERPLATE_CAMPAIGN_ID = "boilerplate-campaign-001";

/**
 * @public
 * @function getBoilerplateCampaign
 * @description Factoría que devuelve un objeto de campaña de boilerplate de alta fidelidad.
 * @returns {CampaignWithContent}
 */
export const getBoilerplateCampaign = (): CampaignWithContent => {
  const config: CampaignConfig = {
    id: BOILERPLATE_CAMPAIGN_ID,
    name: "Boilerplate Campaign",
    site_id: null,
    theme: { globalFont: "Inter", globalColors: {} },
    blocks: [],
  };

  return {
    id: BOILERPLATE_CAMPAIGN_ID,
    name: "Boilerplate Campaign",
    site_id: null,
    slug: "boilerplate-slug",
    status: "draft",
    content: config as unknown as Json,
    affiliate_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "dev-user-001",
    sites: null,
  };
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Tipo (`TS2352`)**: ((Implementada)) La función ahora devuelve un objeto que cumple con el contrato `CampaignWithContent`, resolviendo el error de conversión de tipos en `editor.data.ts`.
 *
 * =====================================================================
 */
// src/lib/builder/boilerplate.ts
