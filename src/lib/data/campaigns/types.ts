// src/lib/data/campaigns/types.ts
/**
 * @file src/lib/data/campaigns/types.ts
 * @description Contratos de datos y SSoT para el módulo de campañas. Sincronizado
 *              para exportar todos los tipos necesarios para sus consumidores.
 * @author Raz Podesta - MetaShark Tech
 * @copilot RaZ WriTe
 * @version 3.1.0
 * Florianópolis/SC, Brazil
 * @see .docs-espejo/lib/data/campaigns/types.ts.md
 */
import { type Tables } from "@/lib/types/database";

export type CampaignMetadata = Tables<"campaigns"> & {
  status: string; // Enriquecido desde el JOIN
};

export type CampaignWithContent = Tables<"campaigns"> & {
  sites: { workspace_id: string; subdomain: string | null } | null;
};

export type CampaignSiteInfo = {
  site_id: string | null;
  workspace_id: string;
};

export const CAMPAIGN_STATUS_FILTERS = [
  "all",
  "draft",
  "published",
  "archived",
] as const;
export type CampaignStatusFilter = (typeof CAMPAIGN_STATUS_FILTERS)[number];

export const CAMPAIGN_SORT_OPTIONS = [
  "updated_at_desc",
  "name_asc",
  "name_desc",
] as const;
export type CampaignSortOption = (typeof CAMPAIGN_SORT_OPTIONS)[number];
// src/lib/data/campaigns/types.ts
