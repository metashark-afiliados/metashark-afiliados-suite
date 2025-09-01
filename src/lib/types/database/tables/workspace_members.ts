// src/lib/types/database/tables/workspace_members.ts
/**
 * @file workspace_members.ts
 * @description Define el contrato de datos atómico para la tabla de unión
 *              `workspace_members`. Sincronizado con la arquitectura "Lean Database"
 *              para utilizar una clave foránea `role_id` en lugar de un ENUM.
 * @author L.I.A Legacy
 * @copilot RaZ WriTe
 * @version 2.0.0
 * @see .docs-espejo/lib/types/database/tables/workspace_members.ts.md
 */
export type WorkspaceMembers = {
  Row: {
    created_at: string;
    id: string;
    role_id: number;
    user_id: string;
    workspace_id: string;
  };
  Insert: {
    created_at?: string;
    id?: string;
    role_id: number;
    user_id: string;
    workspace_id: string;
  };
  Update: {
    created_at?: string;
    id?: string;
    role_id?: number;
    user_id?: string;
    workspace_id?: string;
  };
  Relationships: [
    {
      foreignKeyName: "workspace_members_user_id_fkey";
      columns: ["user_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "workspace_members_workspace_id_fkey";
      columns: ["workspace_id"];
      isOneToOne: false;
      referencedRelation: "workspaces";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "workspace_members_role_id_fkey";
      columns: ["role_id"];
      isOneToOne: false;
      referencedRelation: "workspace_roles";
      referencedColumns: ["id"];
    },
  ];
};
// src/lib/types/database/tables/workspace_members.ts
