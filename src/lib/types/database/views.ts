// src/lib/types/database/views.ts
/**
 * @file views.ts
 * @description Define los contratos de datos completos para las Vistas de la base de datos.
 *              Ha sido refactorizado a un estándar de élite para que su estructura
 *              refleje el formato de los tipos de tabla (`{ Row: ... }`) y para
 *              utilizar la sintaxis de acceso a tipos correcta para `Enums`,
 *              resolviendo una cascada de errores de tipo.
 * @author L.I.A. Legacy
 * @copilot RaZ WriTe
 * @version 3.0.0
 * @see .docs-espejo/lib/types/database/views.ts.md
 */
import { type Enums, type Tables } from "./";

/**
 * @public
 * @typedef UserProfilesWithEmail
 * @description Contrato para la vista que une `profiles` y `auth.users`.
 *              Proporciona una vista unificada de la información del perfil del usuario.
 */
export type UserProfilesWithEmail = {
  Row: {
    app_role: Enums<"app_role"> | null;
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
 * @description Contrato para la vista que une `sites` con un conteo de sus campañas.
 *              Utilizada para optimizar las consultas en la página "Mis Sitios".
 */
export type SitesWithCampaignCounts = {
  Row: Tables<"sites"> & {
    campaign_count: number;
  };
  Insert: never;
  Update: never;
};
// src/lib/types/database/views.ts
