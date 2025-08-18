// src/lib/types/database/tables/sites.ts
/**
 * @file sites.ts
 * @description Define el contrato de datos atómico para la tabla `sites`.
 *              Sincronizado para incluir la propiedad `status`, resolviendo una
 *              desincronización crítica con el esquema de la base de datos.
 * @author L.I.A Legacy
 * @version 2.1.0 (Schema Synchronized)
 */
import { type Enums } from "../enums";

export type Sites = {
  Row: {
    created_at: string;
    custom_domain: string | null;
    description: string | null;
    icon: string | null;
    id: string;
    name: string;
    owner_id: string | null;
    subdomain: string | null;
    updated_at: string | null;
    workspace_id: string;
    status: Enums["site_status"]; // <-- PROPIEDAD RESTAURADA
  };
  Insert: {
    created_at?: string;
    custom_domain?: string | null;
    description?: string | null;
    icon?: string | null;
    id?: string;
    name: string;
    owner_id?: string | null;
    subdomain?: string | null;
    updated_at?: string | null;
    workspace_id: string;
    status?: Enums["site_status"]; // <-- PROPIEDAD RESTAURADA
  };
  Update: {
    created_at?: string;
    custom_domain?: string | null;
    description?: string | null;
    icon?: string | null;
    id?: string;
    name?: string;
    owner_id?: string | null;
    subdomain?: string | null;
    updated_at?: string | null;
    workspace_id?: string;
    status?: Enums["site_status"]; // <-- PROPIEDAD RESTAURADA
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
  ];
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Esquema**: ((Implementada)) Se ha añadido la propiedad `status` al contrato de tipo, resolviendo la desincronización con el `schema.sql` y corrigiendo la causa raíz del error TS2352.
 *
 * @subsection Melhorias Futuras
 * 1. **Estado de Dominio Personalizado**: ((Vigente)) Adicionar un campo `custom_domain_status` de tipo ENUM para gerenciar el proceso de verificação de domínios.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/sites.ts
