// src/lib/actions/index.ts
/**
 * @file src/lib/actions/index.ts
 * @description Manifiesto de la API de Acciones del Servidor (Barrel File).
 *              Esta es la Única Fuente de Verdad para consumir Server Actions
 *              desde los componentes de cliente. Ha sido actualizado para incluir
 *              el nuevo namespace `newsletter`.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */

export * as admin from "./admin.actions";
//export * as auth from "./auth.actions";
export * as builder from "./builder.actions";
export * as campaigns from "./campaigns.actions";
export * as invitations from "./invitations.actions";
export * as newsletter from "./newsletter.actions";
export * as password from "./password.actions";
export * as profiles from "./profiles.actions";
export * as session from "./session.actions";
export * as sites from "./sites.actions";
export * as telemetry from "./telemetry.actions";
export * as workspaces from "./workspaces.actions";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Manifiesto**: ((Implementada)) Se ha añadido la exportación del nuevo módulo atómico `newsletter`, manteniendo el manifiesto de la capa de acciones consistente con la estructura de archivos y haciendo que la nueva acción sea consumible.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Este archivo es un candidato ideal para ser mantenido por un script de build.
 *
 * =====================================================================
 */
// src/lib/actions/index.ts
