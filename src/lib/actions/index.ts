// src/lib/actions/index.ts
/**
 * @file src/lib/actions/index.ts
 * @description Manifiesto principal de la API de Acciones del Servidor. Ha sido
 *              refactorizado para eliminar la directiva "server-only", resolviendo
 *              un error de build crítico al permitir importaciones atómicas desde
 *              el cliente, y **ahora incluye la Server Action de L.I.A.**
 * @author Raz Podestá
 * @version 8.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import * as admin from "./admin.actions";
import * as auth from "./auth.actions";
import * as builder from "./builder.actions";
import * as campaigns from "./campaigns.actions";
import * as invitations from "./invitations.actions";
// --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Importación de L.I.A. Actions ---
import * as lia from "./lia.actions";
// --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
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
  invitations,
  lia, // <-- NUEVA EXPORTACIÓN
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
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 8.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Manifiesto**: ((Implementada)) Se ha añadido la exportación del nuevo módulo `lia.actions.ts`. Esto garantiza que la Server Action de IA esté disponible para el consumo en el cliente y mantiene el manifiesto como la SSoT para las acciones.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Este archivo manifiesto es un candidato ideal para ser generado y mantenido por un script que lea la estructura del directorio `actions`, eliminando la necesidad de actualizaciones manuales.
 *
 * =====================================================================
 */
