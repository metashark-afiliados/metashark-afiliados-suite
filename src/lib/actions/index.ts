// src/lib/actions/index.ts
/**
 * @file src/lib/actions/index.ts
 * @description Manifiesto principal de la API de Acciones del Servidor.
 *              Corregido para usar una sintaxis de re-exportación directa,
 *              resolviendo un error de resolución de módulo.
 * @author Raz Podestá
 * @version 5.1.0
 */
import "server-only";

import * as admin from "./admin.actions";
import * as builder from "./builder.actions";
import * as invitations from "./invitations.actions";
import * as newsletter from "./newsletter.actions";
import * as password from "./password.actions";
import * as profiles from "./profiles.actions";
import * as session from "./session.actions";
import * as sites from "./sites.actions";
import * as telemetry from "./telemetry.actions";
// --- INICIO DE CORRECCIÓN ---
// Se re-exportan los namespaces directamente para evitar ambigüedades.
export * from "./campaigns.actions";
export * from "./workspaces.actions";
// --- FIN DE CORRECCIÓN ---

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
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Build (TS2305)**: ((Implementada)) Se ha cambiado la sintaxis a `export * from ...` y se ha reestructurado la exportación. Esto resuelve el error de compilación al eliminar la ambigüedad en la importación/exportación de namespaces.
 *
 * =====================================================================
 */
// src/lib/actions/index.ts
