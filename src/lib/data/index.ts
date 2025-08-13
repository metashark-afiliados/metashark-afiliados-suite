// src/lib/data/index.ts
/**
 * @file src/lib/data/index.ts
 * @description Manifiesto de la Capa de Datos (Barrel File). Ha sido sincronizado
 *              con la nueva arquitectura de datos atómica para la entidad 'campaigns',
 *              resolviendo una desincronización crítica que causaba fallos de
 *              compilación en cascada.
 * @author Raz Podestá
 * @version 2.0.0
 */
export * as admin from "./admin";
export * as campaignsData from "./campaigns";
export * as invitations from "./invitations";
export * as modules from "./modules";
export * as notifications from "./notifications";
export * as permissions from "./permissions";
export * as sites from "./sites";
export * as workspaces from "./workspaces";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización Arquitectónica**: ((Implementada)) Se ha corregido la exportación de `campaigns` para que apunte al nuevo manifiesto `src/lib/data/campaigns/index.ts`, restaurando la integridad del grafo de dependencias de la capa de datos.
 *
 * =====================================================================
 */
// src/lib/data/index.ts
