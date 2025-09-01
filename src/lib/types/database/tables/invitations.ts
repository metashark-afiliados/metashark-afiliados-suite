// src/lib/types/database/tables/invitations.ts
/**
 * @file invitations.ts
 * @description Define el contrato de datos atómico para la tabla `invitations`.
 *              Sincronizado con la arquitectura "Lean Database" para utilizar
 *              una clave foránea `role_id` en lugar de un ENUM.
 * @author L.I.A Legacy
 * @copilot RaZ WriTe
 * @version 2.0.0
 * @see .docs-espejo/lib/types/database/tables/invitations.ts.md
 */
export type Invitations = {
  Row: {
    created_at: string;
    id: string;
    invitee_email: string;
    invited_by: string;
    role_id: number;
    status: string;
    updated_at: string;
    workspace_id: string;
  };
  Insert: {
    created_at?: string;
    id?: string;
    invitee_email: string;
    invited_by: string;
    role_id: number;
    status?: string;
    updated_at?: string;
    workspace_id: string;
  };
  Update: {
    created_at?: string;
    id?: string;
    invitee_email?: string;
    invited_by?: string;
    role_id?: number;
    status?: string;
    updated_at?: string;
    workspace_id?: string;
  };
  Relationships: [
    {
      foreignKeyName: "invitations_invited_by_fkey";
      columns: ["invited_by"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "invitations_workspace_id_fkey";
      columns: ["workspace_id"];
      isOneToOne: false;
      referencedRelation: "workspaces";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "invitations_role_id_fkey";
      columns: ["role_id"];
      isOneToOne: false;
      referencedRelation: "workspace_roles";
      referencedColumns: ["id"];
    },
  ];
};
// src/lib/types/database/tables/invitations.ts
