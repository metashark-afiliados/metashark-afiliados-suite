// src/lib/types/database/tables/index.ts
/**
 * @file index.ts
 * @description Archivo barril para la exportación modular de todos los tipos de tabla.
 *              Actualizado para incluir la entidad `feature_modules` y eliminar la obsoleta `feature_flags`.
 * @author Raz Podestá
 * @version 3.2.0
 */
export * from "./achievements";
export * from "./affiliate_products";
export * from "./asset_library";
export * from "./audit_logs";
export * from "./brand_kits";
export * from "./campaigns";
export * from "./coupons";
export * from "./custom_blocks";
export * from "./customers";
export * from "./feature_modules";
export * from "./invitations";
export * from "./notifications";
export * from "./prices";
export * from "./product_categories";
export * from "./products";
export * from "./profiles";
export * from "./site_templates";
export * from "./sites";
export * from "./subscribers";
export * from "./subscriptions";
export * from "./system_errors";
export * from "./template_categories";
export * from "./ticket_messages";
export * from "./tickets";
export * from "./user_achievements";
export * from "./user_tokens";
export * from "./visitor_logs";
export * from "./workspace_members";
export * from "./workspaces";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Esquema**: ((Implementada)) Se ha actualizado el manifiesto para reflejar la SSoT correcta de las tablas, eliminando `feature_flags` y añadiendo `feature_modules`.
 * =====================================================================
 */
// src/lib/types/database/tables/index.ts