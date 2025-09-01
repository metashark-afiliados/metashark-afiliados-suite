// src/lib/types/database/tables/sites.ts
/**
 * @file sites.ts
 * @description Define el contrato de datos atómico para la tabla `sites`.
 *              Sincronizado con la arquitectura "Lean Database" para utilizar
 *              una clave foránea `status_id` en lugar de un ENUM.
 * @author L.I.A Legacy
 * @copilot RaZ WriTe
 * @version 3.0.0
 * @see .docs-espejo/lib/types/database/tables/sites.ts.md
 */
export type Sites = {
  Row: {
    created_at: string;
    custom_domain: string | null;
    description: string | null;
    icon: string | null;
    id: string;
    name: string;
    owner_id: string | null;
    status_id: number; // <-- REFACTORIZADO
    subdomain: string | null;
    updated_at: string | null;
    workspace_id: string;
  };
  Insert: {
    created_at?: string;
    custom_domain?: string | null;
    description?: string | null;
    icon?: string | null;
    id?: string;
    name: string;
    owner_id?: string | null;
    status_id?: number; // <-- REFACTORIZADO
    subdomain?: string | null;
    updated_at?: string | null;
    workspace_id: string;
  };
  Update: {
    created_at?: string;
    custom_domain?: string | null;
    description?: string | null;
    icon?: string | null;
    id?: string;
    name?: string;
    owner_id?: string | null;
    status_id?: number; // <-- REFACTORIZADO
    subdomain?: string | null;
    updated_at?: string | null;
    workspace_id?: string;
  };
  Relationships: [
    {
      foreignKeyName: "sites_owner_id_fkey";
      columns: ["owner_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "sites_workspace_id_fkey";
      columns: ["workspace_id"];
      isOneToOne: false;
      referencedRelation: "workspaces";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "sites_status_id_fkey";
      columns: ["status_id"];
      isOneToOne: false;
      referencedRelation: "site_statuses";
      referencedColumns: ["id"];
    },
  ];
};
// src/lib/types/database/tables/sites.ts
