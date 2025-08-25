// src/lib/types/database/tables/creations.ts
/**
 * @file creations.ts
 * @description Define el contrato de datos atómico para la nueva tabla `creations`.
 *              Esta tabla almacena los diseños soberanos de los usuarios.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
import { type Json } from "../_shared";

export type Creations = {
  Row: {
    id: string;
    created_by: string;
    workspace_id: string;
    name: string;
    content: Json | null;
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    created_by: string;
    workspace_id: string;
    name: string;
    content?: Json | null;
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    name?: string;
    content?: Json | null;
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "creations_created_by_fkey";
      columns: ["created_by"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "creations_workspace_id_fkey";
      columns: ["workspace_id"];
      isOneToOne: false;
      referencedRelation: "workspaces";
      referencedColumns: ["id"];
    },
  ];
};
