// src/lib/validators/schemas.ts
/**
 * @file validators/schemas.ts
 * @description Manifiesto (Barrel File) y API pública para todos los schemas
 *              de validación de lógica de negocio. Sincronizado para incluir
 *              el nuevo módulo de schemas de administración.
 * @author RaZ Podestá - MetaShark Tech
 * @version 9.0.0
 */

export * from "./schemas/_base.schemas";
export * from "./schemas/admin.schemas"; // <-- NUEVA EXPORTACIÓN
export * from "./schemas/auth.schemas";
export * from "./schemas/campaigns.schemas";
export * from "./schemas/creations.schemas";
export * from "./schemas/invitations.schemas";
export * from "./schemas/profiles.schemas";
export * from "./schemas/sites.schemas";
export * from "./schemas/telemetry.schemas";
export * from "./schemas/workspaces.schemas";
// src/lib/validators/schemas.ts
