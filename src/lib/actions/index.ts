// src/lib/actions/index.ts
/**
 * @file src/lib/actions/index.ts
 * @description Manifiesto (Barrel File) y API pública principal para todas las
 *              Server Actions. Sincronizado para reflejar la arquitectura de
 *              dominios atomizada, incluyendo los módulos 'creations' y 'dev'.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 11.0.0
 * @see .docs-espejo/lib/actions/index.ts.md
 */
"use server";
import "server-only";

import * as admin from "./admin.actions";
import * as auth from "./auth.actions";
import * as campaigns from "./campaigns.actions";
import * as contact from "./contact.actions";
import * as creations from "./creations";
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
  campaigns,
  contact,
  creations, // Corregido: Anteriormente 'builder'
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
