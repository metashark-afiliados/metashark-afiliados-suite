// src/lib/actions/index.ts
/**
 * @file src/lib/actions/index.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions.
 *              Ha sido refactorizado para eliminar las directivas de runtime
 *              incorrectas ("server-only") y para incluir todos los módulos de
 *              acción, completando su rol como SSoT de la API de acciones.
 * @author Raz Podestá - MetaShark Tech
 * @version 9.0.0
 * @date 2025-08-30
 * @contact raz.metashark.tech
 */
import * as admin from "./admin.actions";
import * as auth from "./auth.actions";
import * as builder from "./builder.actions";
import * as campaigns from "./campaigns.actions";
import * as contact from "./contact.actions";
import * as invitations from "./invitations.actions";
import * as lia from "./lia.actions";
import * as newsletter from "./newsletter.actions";
import * as onboarding from "./onboarding.actions";
import * as password from "./password.actions";
import * as profiles from "./profiles.actions";
import * as sentry from "./sentry.actions";
import * as session from "./session.actions";
import * as sites from "./sites.actions";
import * as telemetry from "./telemetry.actions";
import * as workspaces from "./workspaces.actions";

export {
  admin,
  auth,
  builder,
  campaigns,
  contact,
  invitations,
  lia,
  newsletter,
  onboarding,
  password,
  profiles,
  sentry,
  session,
  sites,
  telemetry,
  workspaces,
};
// src/lib/actions/index.ts
