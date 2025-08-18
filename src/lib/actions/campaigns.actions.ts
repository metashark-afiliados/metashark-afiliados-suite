// src/lib/actions/index.ts
/**
 * @file src/lib/actions/index.ts
 * @description Manifiesto de la API de Acciones del Servidor. Ha sido refactorizado
 *              a un estándar de élite para ensamblar el namespace `campaigns` a
 *              partir de módulos de acción atómicos, completando la refactorización
 *              de "Atomicidad Radical".
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
import * as admin from "./admin.actions";
import * as builder from "./builder.actions";
import { archiveCampaignAction } from "./campaigns/archive.action";
import { createCampaignAction } from "./campaigns/create.action";
import { createCampaignFromTemplateAction } from "./campaigns/create-from-template.action";
import { deleteCampaignAction } from "./campaigns/delete.action";
import { duplicateCampaignAction } from "./campaigns/duplicate.action";
import * as invitations from "./invitations.actions";
import * as newsletter from "./newsletter.actions";
import * as password from "./password.actions";
import * as profiles from "./profiles.actions";
import * as session from "./session.actions";
import * as sites from "./sites.actions";
import * as telemetry from "./telemetry.actions";
import * as workspaces from "./workspaces.actions";

// Ensamblaje del namespace 'campaigns' a partir de acciones atómicas
export const campaigns = {
  archiveCampaignAction,
  createCampaignAction,
  createCampaignFromTemplateAction,
  deleteCampaignAction,
  duplicateCampaignAction,
};

export {
  admin,
  builder,
  invitations,
  newsletter,
  password,
  profiles,
  session,
  sites,
  telemetry,
  workspaces,
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Ensamblaje (LEGO)**: ((Implementada)) Este manifiesto ya no exporta un monolito. Ahora importa piezas atómicas y las ensambla en un namespace cohesivo, una implementación canónica de la "Filosofía LEGO".
 *
 * =====================================================================
 */
// src/lib/actions/index.ts