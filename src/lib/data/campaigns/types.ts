// src/lib/data/campaigns/types.ts
/**
 * @file src/lib/data/campaigns/types.ts
 * @description Contratos de datos y SSoT para el módulo de campañas. Ha sido
 *              refactorizado a un estándar de élite para incluir su propio
 *              contrato de ordenamiento (`CampaignSortOption`), reforzando la
 *              soberanía del dominio y desacoplándolo del módulo de sitios.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type Tables } from "@/lib/types/database";

export type CampaignMetadata = Pick<
  Tables<"campaigns">,
  | "id"
  | "site_id"
  | "name"
  | "slug"
  | "status"
  | "created_at"
  | "updated_at"
  | "affiliate_url"
>;

export type CampaignWithContent = Tables<"campaigns"> & {
  sites: { workspace_id: string; subdomain: string | null } | null;
};

export type CampaignSiteInfo = {
  site_id: string | null;
  workspace_id: string;
};

/**
 * @public
 * @constant CAMPAIGN_SORT_OPTIONS
 * @description SSoT para las opciones de ordenamiento válidas en la gestión de campañas.
 */
export const CAMPAIGN_SORT_OPTIONS = [
  "updated_at_desc",
  "name_asc",
  "name_desc",
] as const;

/**
 * @public
 * @typedef CampaignSortOption
 * @description Define el contrato de tipo para las opciones de ordenamiento de campañas.
 */
export type CampaignSortOption = (typeof CAMPAIGN_SORT_OPTIONS)[number];

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Tipos Derivados de Zod**: Para una seguridad de tipos de élite, todos los tipos en este archivo podrían ser inferidos a partir de schemas de Zod, garantizando que el contrato de tiempo de ejecución y el contrato de tiempo de compilación estén siempre sincronizados.
 * 2. **Guardián de Tipo `isCampaignSortOption`**: Exportar un guardián de tipo (`isCampaignSortOption`) para validar de forma segura los `searchParams` de la URL que controlan el ordenamiento.
 * 3. **Contrato de Filtros de Campaña**: Crear y exportar tipos para los filtros de estado de campaña (`CampaignStatusFilter`), completando el contrato de la API de gestión.
 * 4. **Contrato de Paginación**: Definir tipos para las opciones de paginación (`PaginationOptions`) para estandarizar la API de todas las funciones de obtención de datos paginados.
 * 5. **Tipo `CampaignFull`**: Crear un tipo `CampaignFull` que represente una campaña con todas sus relaciones posibles (sitio, creación, propietario) para ser utilizado en vistas detalladas.
 * 6. **Documentación TSDoc de Propiedades**: Añadir comentarios TSDoc a cada propiedad de los tipos exportados para clarificar su propósito.
 * 7. **Sincronización con ENUMs de DB**: El tipo `CampaignStatus` (actualmente implícito en `CampaignMetadata`) debería derivarse del ENUM de la base de datos (`Enums<'campaign_status'>`) para una sincronización perfecta.
 * 8. **Contrato `CampaignCreationPayload`**: Definir y exportar un tipo para el payload de creación de campañas, mejorando la seguridad en las Server Actions.
 * 9. **Refinamiento de `CampaignMetadata`**: El tipo `CampaignMetadata` podría ser más estricto, por ejemplo, asegurando que `updated_at` no sea `null` si se ordena por él.
 * =====================================================================
 */
// src/lib/data/campaigns/types.ts
