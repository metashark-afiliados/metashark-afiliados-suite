// src/lib/actions/campaigns.actions.ts
/**
 * @file src/lib/actions/campaigns.actions.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              del dominio de campañas. Ensambla y exporta todas las acciones
 *              atómicas de forma explícita, adhiriéndose a la Constitución.
 * @author L.I.A. Legacy
 * @version 5.0.0
 * @see .docs-espejo/lib/actions/campaigns.actions.ts.md
 */
"use server";
import "server-only";

export { archiveCampaignAction } from "./campaigns/archive.action";
export { assignSiteToCampaignAction } from "./campaigns/assign-site.action";
export { createCampaignAction } from "./campaigns/create.action";
export { createCreationAction as createCampaignFromTemplateAction } from "./campaigns/create-from-template.action";
export { deleteCampaignAction } from "./campaigns/delete.action";
export { duplicateCampaignAction } from "./campaigns/duplicate.action";
// src/lib/actions/campaigns.actions.ts
