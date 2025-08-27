// src/lib/types/database/views.ts
/**
 * @file views.ts
 * @description Define los contratos de datos completos para las Vistas de la base de datos.
 *              Ha sido refactorizado a un estándar de élite para que su estructura
 *              refleje el formato de los tipos de tabla (`{ Row: ... }`) y para
 *              utilizar la sintaxis de acceso a tipos correcta para `Enums`,
 *              resolviendo una cascada de errores de tipo.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { type Enums } from "./enums";

/**
 * @public
 * @typedef UserProfilesWithEmail
 * @description Tipo para la vista que une `profiles` y `auth.users`.
 */
export type UserProfilesWithEmail = {
  Row: {
    app_role: Enums["app_role"] | null;
    avatar_url: string | null;
    email: string | null;
    full_name: string | null;
    id: string | null;
  };
  Insert: never;
  Update: never;
};

/**
 * @public
 * @typedef SitesWithCampaignCounts
 * @description Tipo para la vista que une `sites` con un conteo de sus campañas.
 */
export type SitesWithCampaignCounts = {
  Row: {
    campaign_count: number;
    created_at: string;
    custom_domain: string | null;
    description: string | null;
    icon: string | null;
    id: string;
    name: string;
    owner_id: string | null;
    status: Enums["site_status"];
    subdomain: string | null;
    updated_at: string | null;
    workspace_id: string;
  };
  Insert: never;
  Update: never;
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución Sistémica de Errores de Tipo**: ((Implementada)) Se ha corregido la sintaxis de `Enums<"nombre_enum">` a `Enums["nombre_enum"]` y se ha anidado la definición bajo una propiedad `Row`. Esto resuelve la causa raíz de los errores `TS2315` y `TS2339`, estabilizando la capa de tipos.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Continuar monitorizando las actualizaciones de la CLI de Supabase para la eventual generación automática de tipos de Vistas, lo que haría este archivo obsoleto.
 *
 * =====================================================================
 */
// src/lib/types/database/views.ts
