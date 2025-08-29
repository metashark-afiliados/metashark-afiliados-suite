// src/lib/actions/index.ts
/**
 * @file src/lib/actions/index.ts
 * @description Manifiesto principal de la API de Acciones del Servidor. Ha sido
 *              refactorizado para eliminar la directiva "server-only", resolviendo
 *              un error de build crítico al permitir importaciones atómicas desde
 *              el cliente, y **ahora incluye las Server Actions de L.I.A. y Contacto**.
 * @author Raz Podestá - MetaShark Tech
 * @version 9.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 */
import * as admin from "./admin.actions";
import * as auth from "./auth.actions";
import * as builder from "./builder.actions";
import * as campaigns from "./campaigns.actions";
// --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Importación de Contact Actions ---
import * as contact from "./contact.actions";
// --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
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
  contact, // <-- NUEVA EXPORTACIÓN
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
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 9.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Manifiesto**: ((Implementada)) Se ha añadido la exportación del nuevo módulo `contact.actions.ts`. Esto garantiza que la Server Action de contacto esté disponible para el consumo en el cliente y mantiene el manifiesto como la SSoT para las acciones.
 * 2. **Versionado Consistente**: ((Implementada)) Se ha incrementado la versión a `9.0.0` para reflejar esta adición significativa.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Este archivo manifiesto es un candidato ideal para ser generado y mantenido por un script que lea la estructura del directorio `actions`, eliminando la necesidad de actualizaciones manuales.
 *
 * =====================================================================
 */
