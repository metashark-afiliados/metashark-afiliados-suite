// src/lib/types/database/tables/campaigns.ts
/**
 * @file campaigns.ts
 * @description Define el contrato de datos atómico para la tabla `campaigns`.
 *              Sincronizado con la nueva arquitectura para reflejar la relación
 *              con la tabla `creations`.
 * @author Raz Podestá
 * @version 4.0.0
 */
import { type Enums } from "../enums";

export type Campaigns = {
  Row: {
    id: string;
    creation_id: string;
    site_id: string;
    name: string;
    slug: string;
    status: Enums["campaign_status"];
    affiliate_url: string | null;
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    creation_id: string;
    site_id: string;
    name: string;
    slug: string;
    status?: Enums["campaign_status"];
    affiliate_url?: string | null;
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    name?: string;
    slug?: string;
    status?: Enums["campaign_status"];
    affiliate_url?: string | null;
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "campaigns_creation_id_fkey";
      columns: ["creation_id"];
      isOneToOne: false;
      referencedRelation: "creations";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "campaigns_site_id_fkey";
      columns: ["site_id"];
      isOneToOne: false;
      referencedRelation: "sites";
      referencedColumns: ["id"];
    },
  ];
};
