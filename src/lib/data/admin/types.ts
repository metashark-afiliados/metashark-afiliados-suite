// src/lib/data/admin/types.ts
/**
 * @file types.ts
 * @description Aparato de contrato de datos y SSoT para el módulo de
 *              administración. Ha sido refactorizado para consumir correctamente
 *              el helper de tipo genérico `Views<T>`, resolviendo la cascada de
 *              errores de tipo TS2339.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type Tables, type Views } from "@/lib/types/database";

// --- INICIO DE CORRECCIÓN DE TIPO (TS2339) ---
// El helper genérico `Views<T>` ya extrae la propiedad `Row`.
// La sintaxis correcta es consumir el helper directamente, sin el `["Row"]` redundante.
export type UserProfilesWithEmail = Views<"user_profiles_with_email">;

export type SiteWithCampaignsCount = Views<"sites_with_campaign_counts">;
// --- FIN DE CORRECCIÓN DE TIPO (TS2339) ---

export type CampaignWithSiteInfo = Tables<"campaigns"> & {
  sites: { subdomain: string | null } | null;
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución Sistémica de `TS2339`**: ((Implementada)) Se ha eliminado el acceso `["Row"]` redundante. Esta corrección alinea el consumo de tipos con la definición del helper genérico `Views<T>`, resolviendo la causa raíz de los errores de compilación y estabilizando la capa de tipos.
 * 2. **Cohesión de Módulo**: ((Implementada)) Este aparato ahora sirve como la SSoT canónica y correcta para los tipos de datos del módulo de administración.
 *
 * @subsection Melhorias Futuras
 * 1. **Renombrar Helper Genérico**: ((Vigente)) Para una DX de élite y para prevenir esta confusión en el futuro, el helper genérico `Views<T>` en `_shared.ts` podría ser renombrado a `ViewRow<T>` para que su propósito (extraer el tipo `Row`) sea semánticamente explícito.
 *
 * =====================================================================
 */
// src/lib/data/admin/types.ts
