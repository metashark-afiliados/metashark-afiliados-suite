// src/lib/data/campaigns/types.ts
/**
 * @file src/lib/data/campaigns/types.ts
 * @description Contratos de datos y SSoT para el módulo de campañas. Sincronizado
 *              con la arquitectura "Lean Database" para utilizar `status_id`.
 * @author L.I.A. Legacy
 * @copilot RaZ WriTe
 * @version 3.0.0
 * @see .docs-espejo/lib/data/campaigns/types.ts.md
 */
import { type Tables } from "@/lib/types/database";

export type CampaignMetadata = Pick<
  Tables<"campaigns">,
  | "id"
  | "site_id"
  | "name"
  | "slug"
  | "status_id"
  | "created_at"
  | "updated_at"
  | "affiliate_url"
  | "creation_id"
>;

export type CampaignWithContent = Tables<"campaigns"> & {
  sites: { workspace_id: string; subdomain: string | null } | null;
};

export type CampaignSiteInfo = {
  site_id: string | null;
  workspace_id: string;
};

/**
 * @public
 * @constant CAMPAIGN_SORT_OPTIONS
 * @description SSoT para las opciones de ordenamiento válidas en la gestión de campañas.
 */
export const CAMPAIGN_SORT_OPTIONS = [
  "updated_at_desc",
  "name_asc",
  "name_desc",
] as const;

/**
 * @public
 * @typedef CampaignSortOption
 * @description Define el contrato de tipo para las opciones de ordenamiento de campañas.
 */
export type CampaignSortOption = (typeof CAMPAIGN_SORT_OPTIONS)[number];
// src/lib/data/campaigns/types.ts
