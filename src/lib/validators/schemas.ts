// src/lib/validators/schemas.ts
/**
 * @file validators/schemas.ts
 * @description Manifiesto (Barrel File) y API pública para todos los schemas
 *              de validación de lógica de negocio. Este aparato ha sido
 *              refactorizado a su estado final, actuando como un ensamblador
 *              puro que re-exporta los módulos atómicos de su directorio `schemas/`.
 * @author Raz Podestá - MetaShark Tech
 * @version 8.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */

// --- RE-EXPORTACIÓN DE LA BIBLIOTECA DE SCHEMAS ATÓMICOS ---
export * from "./schemas/_base.schemas";
export * from "./schemas/auth.schemas";
export * from "./schemas/campaigns.schemas";
export * from "./schemas/creations.schemas";
export * from "./schemas/invitations.schemas";
export * from "./schemas/profiles.schemas";
export * from "./schemas/sites.schemas";
export * from "./schemas/telemetry.schemas";
export * from "./schemas/workspaces.schemas";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Generación Automática de Manifiesto**: Para una DX de élite y para prevenir errores de omisión, este archivo es un candidato ideal para ser generado y mantenido por un script (`pnpm gen:manifests`) que lea la estructura del directorio `schemas/` y construya las exportaciones automáticamente.
 * 2. **Organización por Sub-dominios**: Si el número de schemas crece significativamente, se podría introducir una capa adicional de anidamiento en el directorio `schemas/` (ej. `schemas/user/`, `schemas/content/`) y este manifiesto podría exportar los módulos bajo namespaces (`export * as userSchemas from './schemas/user'`).
 * 3. **Validación de Integridad en CI/CD**: Implementar un paso en el pipeline de CI/CD que ejecute el script de generación de manifiestos y falle si detecta una desincronización entre el archivo y la estructura del directorio, forzando la consistencia.
 * 4. **Documentación de API Pública**: Añadir TSDoc a cada re-exportación para clarificar qué dominio de negocio está siendo expuesto por cada módulo.
 * =====================================================================
 */
// src/lib/validators/schemas.ts
