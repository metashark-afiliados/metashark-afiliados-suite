// src/lib/types/database/tables/workspaces.ts
/**
 * @file workspaces.ts
 * @description Define el contrato de datos atómico para la tabla `workspaces`.
 *              Ha sido sincronizado con el `schema.sql` canónico para reintroducir
 *              la propiedad `icon`, resolviendo una desincronización de tipos
 *              y un error de compilación crítico (`TS2353`) en el mock factory.
 * @author Raz Podestá
 * @version 3.1.0
 */
export type Workspaces = {
  Row: {
    id: string;
    name: string;
    owner_id: string;
    icon: string | null; // <-- PROPIEDAD RESTAURADA
    current_site_count: number;
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    name: string;
    owner_id: string;
    icon?: string | null; // <-- PROPIEDAD RESTAURADA
    current_site_count?: number;
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    name?: string;
    owner_id?: string;
    icon?: string | null; // <-- PROPIEDAD RESTAURADA
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
 * 1. **Sincronización de Esquema (Resolución de `TS2353`)**: ((Implementada)) Se ha reintroducido la propiedad `icon` en los tipos `Row`, `Insert`, y `Update`. Esto alinea el contrato de TypeScript con el `schema.sql` y resuelve el error de tipo en `mock-client-factory.ts`.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Formato de Icono**: ((Vigente)) El campo `icon` está diseñado para almacenar un único emoji. Para una integridad de datos de élite, se podría crear un `WorkspaceIconSchema` de Zod con una validación de regex para asegurar que el valor sea siempre un emoji válido, y usarlo en los schemas de validación de Server Action. Propondré esta mejora en la próxima épica de refactorización de validadores.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/workspaces.ts
