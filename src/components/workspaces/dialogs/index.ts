// src/components/workspaces/dialogs/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) para los componentes de diálogo
 *              atómicos del módulo de workspaces. Sincronizado para incluir
 *              el nuevo `RenameWorkspaceDialog`.
 * @author Raz Podestá
 * @version 2.1.0
 */
export * from "./CreateWorkspaceDialog";
export * from "./InviteMemberDialog";
export * from "./DeleteWorkspaceDialog";
export * from "./RenameWorkspaceDialog";
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Módulo**: ((Implementada)) Se ha añadido la exportación de `RenameWorkspaceDialog`, resolviendo el error de compilación `TS2724`.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Este archivo es un candidato ideal para ser generado por un script que lea el contenido del directorio, eliminando la posibilidad de este tipo de error de omisión.
 *
 * =====================================================================
 */
// src/components/workspaces/dialogs/index.ts
