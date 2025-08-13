/**
 * @file src/lib/data/campaigns/types.ts
 * @description Tipos de datos compartidos para los módulos de campañas.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { type Tables } from "@/lib/types/database";

export type CampaignMetadata = Pick<
  Tables<"campaigns">,
  | "id"
  | "site_id"
  | "name"
  | "slug"
  | "status"
  | "created_at"
  | "updated_at"
  | "affiliate_url"
>;

export type CampaignWithContent = Tables<"campaigns"> & {
  sites: { workspace_id: string; subdomain: string | null } | null;
};
