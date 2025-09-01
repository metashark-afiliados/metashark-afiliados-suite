// src/lib/types/database/tables/campaigns.ts
/**
 * @file campaigns.ts
 * @description Define el contrato de datos atómico para la tabla `campaigns`.
 *              Sincronizado con la arquitectura "Lean Database" para utilizar
 *              una clave foránea `status_id` en lugar de un ENUM.
 * @author L.I.A Legacy
 * @copilot RaZ WriTe
 * @version 6.0.0
 * @see .docs-espejo/lib/types/database/tables/campaigns.ts.md
 */
export type Campaigns = {
  Row: {
    id: string;
    creation_id: string;
    site_id: string | null;
    name: string;
    slug: string;
    status_id: number; // <-- REFACTORIZADO
    affiliate_url: string | null;
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    creation_id: string;
    site_id: string | null;
    name: string;
    slug: string;
    status_id?: number; // <-- REFACTORIZADO
    affiliate_url?: string | null;
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    name?: string;
    slug?: string;
    status_id?: number; // <-- REFACTORIZADO
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
    {
      foreignKeyName: "campaigns_status_id_fkey";
      columns: ["status_id"];
      isOneToOne: false;
      referencedRelation: "campaign_statuses";
      referencedColumns: ["id"];
    },
  ];
};
// src/lib/types/database/tables/campaigns.ts
