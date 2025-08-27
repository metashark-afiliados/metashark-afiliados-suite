// src/lib/data/admin/types.ts
/**
 * @file types.ts
 * @description Aparato de contrato de datos y SSoT para el módulo de
 *              administración. Ha sido corregido para acceder correctamente a la
 *              propiedad 'Row' de los tipos de `Views`, resolviendo la cascada de
 *              errores de tipo TS2339.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type Tables, type Views } from "@/lib/types/database";

// --- INICIO DE CORRECCIÓN DE TIPO (TS2339) ---
// La estructura correcta para acceder al tipo de fila de una vista es `Views<'view_name'>['Row']`.
// El error indicaba que el tipo de la vista en sí no tenía la propiedad 'Row'.
// La solución canónica es asegurar que la SSoT de `views.ts` tenga la
// estructura `{ Row: {...} }`, haciendo este acceso válido y resolviendo el error
// de tipo en su origen.
export type UserProfilesWithEmail = Views<"user_profiles_with_email">["Row"];

export type SiteWithCampaignsCount = Views<"sites_with_campaign_counts">["Row"];
// --- FIN DE CORRECCIÓN DE TIPO (TS2339) ---

export type CampaignWithSiteInfo = Tables<"campaigns"> & {
  sites: { subdomain: string | null } | null;
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Resolución de Error de Tipo (`TS2339`)**: Se ha corregido el acceso a la propiedad `Row` en los tipos de `Views`. Esta refactorización es la solución canónica que depende de que `src/lib/types/database/views.ts` tenga la estructura de tipo correcta, resolviendo la cascada de errores de tipo en su origen.
 * 2. ((Implementada)) **Cohesión de Módulo**: Este aparato ahora sirve como la SSoT canónica y correcta para los tipos de datos del módulo de administración.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Tipos Derivados de RPC**: Si en el futuro se añaden funciones RPC específicas para administración, sus tipos de retorno deberían ser definidos aquí para mantener la cohesión del contrato de datos.
 *
 * =====================================================================
 */
// src/lib/data/admin/types.ts
