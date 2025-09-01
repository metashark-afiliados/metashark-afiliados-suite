// src/lib/actions/index.ts
/**
 * @file src/lib/actions/index.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions.
 *              Sincronizado para incluir el módulo de acciones de 'dev' y
 *              eliminar el obsoleto módulo 'sentry'.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 10.0.0
 * @see .docs-espejo/lib/actions/index.ts.md
 */
import * as admin from "./admin.actions";
import * as auth from "./auth.actions";
import * as builder from "./builder.actions";
import * as campaigns from "./campaigns.actions";
import * as contact from "./contact.actions";
import * as dev from "./dev"; 
import * as invitations from "./invitations.actions";
import * as lia from "./lia.actions";
import * as newsletter from "./newsletter.actions";
import * as onboarding from "./onboarding.actions";
import * as password from "./password.actions";
import * as profiles from "./profiles.actions";
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
  dev,
  invitations,
  lia,
  newsletter,
  onboarding,
  password,
  profiles,
  session,
  sites,
  telemetry,
  workspaces,
};
// src/lib/actions/index.ts
