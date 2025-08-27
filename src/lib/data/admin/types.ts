// src/lib/data/admin/types.ts
/**
 * @file types.ts
 * @description Aparato de contrato de datos y SSoT para el módulo de
 *              administración. Define los tipos de datos compuestos que son
 *              utilizados por las funciones de acceso a datos de alto privilegio.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type Tables, type Views } from "@/lib/types/database";

export type UserProfilesWithEmail = Views<"user_profiles_with_email">;

export type SiteWithCampaignsCount = Views<"sites_with_campaign_counts">;

export type CampaignWithSiteInfo = Tables<"campaigns"> & {
  sites: { subdomain: string | null } | null;
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cohesión de Módulo (SRP)**: ((Implementada)) Este nuevo aparato se convierte en la SSoT canónica para los tipos de datos del módulo de administración, mejorando la organización y desacoplando los contratos de la lógica.
 * 2. **Consistencia Arquitectónica**: ((Implementada)) La creación de este archivo continúa con el patrón de atomización de la capa de datos, haciendo que la estructura del módulo `admin` sea consistente con la del resto del proyecto.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipos Derivados de RPC**: ((Vigente)) Si en el futuro se añaden funciones RPC específicas para administración (ej. `get_platform_statistics`), sus tipos de retorno deberían ser definidos aquí para mantener la cohesión del contrato de datos. Propondré esta adición cuando se implemente dicha funcionalidad.
 *
 * =====================================================================
 */
// src/lib/data/admin/types.ts
