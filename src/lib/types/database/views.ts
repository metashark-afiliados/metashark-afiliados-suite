// src/lib/types/database/views.ts
/**
 * @file views.ts
 * @description Define los contratos de datos completos para las Vistas de la base de datos.
 *              Ha sido refactorizado a un estándar de élite para que su estructura
 *              refleje el formato de los tipos de tabla (`Row`, `Insert`, `Update`),
 *              garantizando la consistencia y resolviendo una cascada de errores de tipo.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { type Enums } from "./enums";

/**
 * @public
 * @typedef UserProfilesWithEmail
 * @description Tipo para la vista que une `profiles` y `auth.users`.
 */
export type UserProfilesWithEmail = {
  // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA ---
  // Se envuelve la definición en una propiedad 'Row' para que coincida con el
  // contrato esperado por el helper de tipos `Views<T>["Row"]`.
  Row: {
    app_role: Enums["app_role"] | null;
    avatar_url: string | null;
    email: string | null;
    full_name: string | null;
    id: string | null;
  };
  // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
  Insert: never; // Las vistas no soportan inserciones
  Update: never; // Las vistas no soportan actualizaciones
};

/**
 * @public
 * @typedef SitesWithCampaignCounts
 * @description Tipo para la vista que une `sites` con un conteo de sus campañas.
 */
export type SitesWithCampaignCounts = {
  // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA ---
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
  // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
  Insert: never;
  Update: never;
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Consistencia Estructural**: La definición de cada tipo de vista ahora está anidada bajo una propiedad `Row`. Esto alinea la estructura con la de los tipos de tabla generados, permite que el helper `Views<T>["Row"]` funcione correctamente y resuelve la causa raíz de la cascada de errores TS2339.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Generación Automática**: Continuar monitorizando las actualizaciones de la CLI de Supabase para la eventual generación automática de tipos de Vistas, lo que haría este archivo obsoleto.
 *
 * =====================================================================
 */
// src/lib/types/database/views.ts
