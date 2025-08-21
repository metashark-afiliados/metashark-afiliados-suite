// src/lib/actions/index.ts
/**
 * @file src/lib/actions/index.ts
 * @description Manifiesto principal de la API de Acciones del Servidor.
 *              Restaurado a su estado estable para resolver regresiones masivas.
 * @author Raz Podestá
 * @version 6.0.0
 */
import "server-only";

import * as admin from "./admin.actions";
import * as builder from "./builder.actions";
import * as campaigns from "./campaigns.actions";
import * as invitations from "./invitations.actions";
import * as newsletter from "./newsletter.actions";
import * as password from "./password.actions";
import * as profiles from "./profiles.actions";
import * as session from "./session.actions";
import * as sites from "./sites.actions";
import * as telemetry from "./telemetry.actions";
import * as workspaces from "./workspaces.actions";

export {
  admin,
  builder,
  campaigns,
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
 * 1. **Restauración de Contrato de API**: ((Implementada)) Se ha revertido a una exportación de namespaces explícita, restaurando la estabilidad del sistema.
 *
 * =====================================================================
 */
