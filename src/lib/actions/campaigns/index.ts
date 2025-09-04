// src/lib/actions/campaigns/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              del dominio de campañas. Ensambla y exporta todas las acciones
 *              atómicas del directorio `campaigns/` de forma explícita.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

export { archiveCampaignAction } from "./archive.action";
export { assignSiteToCampaignAction } from "./assign-site.action";
export { createCampaignAction } from "./create.action";
export { createCreationAction as createCampaignFromTemplateAction } from "./create-from-template.action";
export { deleteCampaignAction } from "./delete.action";
export { duplicateCampaignAction } from "./duplicate.action";
// src/lib/actions/campaigns/index.ts
