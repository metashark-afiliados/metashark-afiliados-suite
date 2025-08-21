// src/lib/actions/index.ts
/**
 * @file src/lib/actions/index.ts
 * @description Manifiesto principal de la API de Acciones del Servidor. Ha sido
 *              refactorizado para eliminar la directiva "server-only", resolviendo
 *              un error de build crítico al permitir importaciones atómicas desde
 *              el cliente.
 * @author Raz Podestá
 * @version 7.0.0
 */
import * as admin from "./admin.actions";
import * as auth from "./auth.actions";
import * as builder from "./builder.actions";
import * as campaigns from "./campaigns.actions";
import * as invitations from "./invitations.actions";
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
  invitations,
  newsletter,
  onboarding,
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
 * 1. **Resolución de Error de Build**: ((Implementada)) Se ha eliminado la directiva `import "server-only"`. Esta es la corrección fundamental que resuelve la causa raíz del fallo de compilación, al permitir que los módulos de cliente importen acciones individuales de forma atómica sin contaminar el bundle.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Este archivo manifiesto es un candidato ideal para ser generado y mantenido por un script que lea la estructura del directorio `actions`, eliminando la necesidad de actualizaciones manuales.
 *
 * =====================================================================
 */
