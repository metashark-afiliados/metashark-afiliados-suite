// src/lib/data/sites/types.ts
/**
 * @file types.ts
 * @description Aparato de contrato de datos y SSoT para la entidad 'sites'.
 *              Refactorizado para alinearse con la arquitectura "Lean Database"
 *              y proveer guardianes de tipo robustos y DRY.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @see .docs-espejo/lib/data/sites/types.ts.md
 */
import { type Tables, type Views } from "@/lib/types/database";

export type ViewMode = "grid" | "list";

// --- Contratos de Filtros y Ordenamiento (SSoT) ---

/**
 * @public
 * @constant SITE_STATUSES
 * @description SSoT de solo lectura para los nombres de estado de sitio válidos.
 */
export const SITE_STATUSES = ["draft", "published", "archived"] as const;

/**
 * @public
 * @constant SITE_SORT_OPTIONS
 * @description SSoT de solo lectura para las opciones de ordenamiento de sitio válidas.
 */
export const SITE_SORT_OPTIONS = [
  "created_at_desc",
  "name_asc",
  "name_desc",
] as const;

/**
 * @public
 * @typedef SiteStatus
 * @description Tipo de unión literal para los estados de sitio.
 */
export type SiteStatus = (typeof SITE_STATUSES)[number];

/**
 * @public
 * @typedef SiteStatusFilter
 * @description Tipo de unión literal para el filtro de estado, incluyendo 'all'.
 */
export type SiteStatusFilter = SiteStatus | "all";

/**
 * @public
 * @typedef SiteSortOption
 * @description Tipo de unión literal para las opciones de ordenamiento.
 */
export type SiteSortOption = (typeof SITE_SORT_OPTIONS)[number];

// --- Guardianes de Tipo (Validación en Tiempo de Ejecución) ---

/**
 * @public
 * @function isSiteStatusFilter
 * @description Guardián de tipo que verifica si un string es un `SiteStatusFilter` válido.
 * @param {any} value - El valor a verificar.
 * @returns {value is SiteStatusFilter}
 */
export function isSiteStatusFilter(value: any): value is SiteStatusFilter {
  return [...SITE_STATUSES, "all"].includes(value);
}

/**
 * @public
 * @function isSiteSortOption
 * @description Guardián de tipo que verifica si un string es una `SiteSortOption` válida.
 * @param {any} value - El valor a verificar.
 * @returns {value is SiteSortOption}
 */
export function isSiteSortOption(value: any): value is SiteSortOption {
  return SITE_SORT_OPTIONS.includes(value);
}

// --- Contratos de Entidades y Vistas ---
export type SiteWithCampaignCount = Views<"sites_with_campaign_counts">;
export type SiteBasicInfo = Pick<
  Tables<"sites">,
  "id" | "subdomain" | "workspace_id" | "name"
>;
// src/lib/data/sites/types.ts
