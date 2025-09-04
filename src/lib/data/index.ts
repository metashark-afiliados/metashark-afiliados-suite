// src/lib/data/index.ts
/**
 * @file src/lib/data/index.ts
 * @description Manifiesto de la Capa de Datos (Barrel File). Ha sido nivelado a
 *              un estándar de élite para consumir los manifiestos de sus módulos
 *              atomizados, incluyendo ahora el módulo `invitations` para
 *              restaurar la integridad de la API de datos.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
 */
import "server-only";

import * as admin from "./admin";
import * as campaignsData from "./campaigns";
import * as invitations from "./invitations"; 
import * as modules from "./modules";
import * as notifications from "./notifications";
import * as permissions from "./permissions";
import * as sites from "./sites";
import * as workspaces from "./workspaces";

export {
  admin,
  campaignsData,
  invitations, 
  modules,
  notifications,
  permissions,
  sites,
  workspaces,
};
// src/lib/data/index.ts
