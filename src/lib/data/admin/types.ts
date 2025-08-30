// src/lib/data/admin/types.ts
/**
 * @file types.ts
 * @description Aparato de contrato de datos y SSoT para el módulo de
 *              administración. Define los tipos para las vistas de la base
 *              de datos y las uniones de datos personalizadas que son
 *              utilizadas por las funciones de acceso a datos de administración.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import "server-only";

import { type Tables, type Views } from "@/lib/types/database";

/**
 * @public
 * @typedef UserProfilesWithEmail
 * @description El contrato de datos para la vista `user_profiles_with_email`.
 *              Combina datos de `auth.users` y `public.profiles`.
 */
export type UserProfilesWithEmail = Views<"user_profiles_with_email">;

/**
 * @public
 * @typedef SiteWithCampaignsCount
 * @description El contrato de datos para la vista `sites_with_campaign_counts`.
 *              Aumenta la tabla `sites` con una columna `campaign_count`.
 */
export type SiteWithCampaignsCount = Views<"sites_with_campaign_counts">;

/**
 * @public
 * @typedef CampaignWithSiteInfo
 * @description Contrato de datos para una campaña unida con la información
 *              esencial de su sitio padre.
 */
export type CampaignWithSiteInfo = Tables<"campaigns"> & {
  sites: { subdomain: string | null } | null;
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Renombrar Helper Genérico**: Para una DX de élite y para prevenir confusiones, el helper genérico `Views<T>` en `_shared.ts` podría ser renombrado a `ViewRow<T>` para que su propósito (extraer el tipo `Row`) sea semánticamente explícito.
 * 2. **Generación Automática de Vistas**: Continuar monitorizando las actualizaciones de la CLI de Supabase para la eventual generación automática de tipos de Vistas, lo que haría este archivo obsoleto y garantizaría una sincronización perfecta.
 * 3. **Schemas Zod para Vistas**: Crear schemas de Zod correspondientes a cada tipo de vista para permitir la validación en tiempo de ejecución de los datos devueltos por la base de datos, añadiendo una capa extra de robustez.
 * =====================================================================
 */
// src/lib/data/admin/types.ts
