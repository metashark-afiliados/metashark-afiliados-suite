// src/lib/data/sites/types.ts
/**
 * @file types.ts
 * @description Aparato de contrato de datos y SSoT para la entidad 'sites'.
 *              Ha sido refactorizado a un estándar de élite para exportar
 *              guardianes de tipo que validan parámetros de URL en tiempo de
 *              ejecución y para corregir la sintaxis de `Enums`, resolviendo
 *              el error de tipo TS2314.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.2.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type Enums, type Tables, type Views } from "@/lib/types/database";

export type ViewMode = "grid" | "list";

// --- Contratos de Filtros y Ordenamiento (SSoT para la Lógica de Negocio) ---
// --- INICIO DE CORRECCIÓN DE TIPO (TS2314) ---
// La sintaxis correcta para acceder a un tipo ENUM específico es `Enums<"nombre_del_enum">`.
// La sintaxis anterior `Enums["site_status"]` era inválida porque `Enums` es un tipo genérico.
export type SiteStatusFilter = Enums<"site_status"> | "all";
// --- FIN DE CORRECCIÓN DE TIPO (TS2314) ---
export const SITE_STATUS_FILTERS: SiteStatusFilter[] = [
  "all",
  "draft",
  "published",
  "archived",
];

export type SiteSortOption = "created_at_desc" | "name_asc" | "name_desc";
export const SITE_SORT_OPTIONS: SiteSortOption[] = [
  "created_at_desc",
  "name_asc",
  "name_desc",
];

// --- Contratos de Parámetros de URL (Blindaje para la Capa de Red) ---
export type SiteStatusParam = SiteStatusFilter | undefined;
export type SiteSortParam = SiteSortOption | undefined;

// --- Guardianes de Tipo (Validación en Tiempo de Ejecución) ---

/**
 * @public
 * @function isSiteStatusFilter
 * @description Guardián de tipo que verifica si un string es un `SiteStatusFilter` válido.
 * @param {any} value - El valor a verificar.
 * @returns {value is SiteStatusFilter} `true` si el valor es un filtro de estado válido.
 */
export function isSiteStatusFilter(value: any): value is SiteStatusFilter {
  return SITE_STATUS_FILTERS.includes(value);
}

/**
 * @public
 * @function isSiteSortOption
 * @description Guardián de tipo que verifica si un string es una `SiteSortOption` válida.
 * @param {any} value - El valor a verificar.
 * @returns {value is SiteSortOption} `true` si el valor es una opción de ordenamiento válida.
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 4.2.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Tipo Crítico (`TS2314`)**: ((Implementada)) Se ha corregido la definición de `SiteStatusFilter` a `Enums<"site_status"> | "all"`, utilizando la sintaxis de acceso por índice genérico correcta.
 * 2. **Consistencia Arquitectónica**: ((Implementada)) Este aparato ahora sirve como un contrato de datos robusto y correcto para la entidad `sites`, eliminando una fuente de inestabilidad en el sistema de tipos.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática desde ENUM**: ((Vigente)) Los arrays de constantes (`SITE_STATUS_FILTERS`) podrían ser generados automáticamente a partir de los `ENUM` de la base de datos para una sincronización de élite. Esto eliminaría la necesidad de mantenerlos manualmente.
 *
 * =====================================================================
 */
// src/lib/data/sites/types.ts
