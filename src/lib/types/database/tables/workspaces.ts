// src/lib/types/database/tables/workspaces.ts
/**
 * @file workspaces.ts
 * @description Define el contrato de datos atómico para la tabla `workspaces`.
 *              Sincronizado con la arquitectura v8.0 para eliminar el campo `icon`.
 * @author Raz Podestá
 * @version 3.0.0
 */
export type Workspaces = {
  Row: {
    id: string;
    name: string;
    owner_id: string;
    current_site_count: number;
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    name: string;
    owner_id: string;
    current_site_count?: number;
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    name?: string;
    owner_id?: string;
    current_site_count?: number;
    created_at?: string;
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "workspaces_owner_id_fkey";
      columns: ["owner_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
  ];
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Simplificación de Esquema**: ((Implementada)) Se ha eliminado la propiedad `icon` del contrato de datos, alineándolo con la nueva directiva de diseño.
 *
 * @subsection Melhorias Futuras
 * 1. **Limites de Recursos**: ((Vigente)) Considerar añadir columnas como `max_sites` o `max_members` que puedan ser configuradas de acuerdo con el `plan_type` del workspace.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/workspaces.ts
