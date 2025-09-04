// src/lib/actions/campaigns.actions.ts
/**
 * @file src/lib/actions/campaigns.actions.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              relacionadas con la entidad `campaigns`. Ensambla y exporta todas
 *              las acciones atómicas del directorio `campaigns/`. Sincronizado
 *              para incluir `createCampaignFromTemplateAction`.
 * @author Raz Podestá
 * @version 4.0.0
 */
"use server";
import "server-only";

export * from "./campaigns/archive.action";
export * from "./campaigns/assign-site.action";
export * from "./campaigns/create.action";
export * from "./campaigns/create-from-template.action";
export * from "./campaigns/delete.action";
export * from "./campaigns/duplicate.action";
// src/lib/actions/campaigns.actions.ts
