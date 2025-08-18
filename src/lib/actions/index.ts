// src/lib/actions/index.ts
/**
 * @file src/lib/actions/index.ts
 * @description Manifiesto de la API de Acciones del Servidor. Ha sido corregido
 *              para utilizar la ruta de importación correcta para las acciones
 *              atomizadas, resolviendo un error de `Module not found`.
 * @author L.I.A. Legacy
 * @version 4.0.1
 */
import * as admin from "./admin.actions";
import * as builder from "./builder.actions";
import { archiveCampaignAction } from "./campaigns/archive.action";
import { createCampaignAction } from "./campaigns/create.action";
import { createCampaignFromTemplateAction } from "./campaigns/create-from-template.action"; // Corregido
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
 * 1. **Corrección de Nomenclatura**: ((Implementada)) La ruta de importación ha sido corregida, resolviendo el `Module not found`.
 *
 * =====================================================================
 */
// src/lib/actions/index.ts