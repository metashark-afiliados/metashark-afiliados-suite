// src/lib/actions/workspaces.actions.ts
/**
 * @file workspaces.actions.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              del dominio de gestión de workspaces. Ensambla y exporta las
 *              acciones atómicas desde sus módulos soberanos.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/workspaces.actions.ts.md
 */
"use server";
import "server-only";

export { createWorkspaceAction } from "./workspaces/createWorkspace.action";
export { deleteWorkspaceAction } from "./workspaces/deleteWorkspace.action";
export { setActiveWorkspaceAction } from "./workspaces/setActiveWorkspace.action";
export { updateWorkspaceNameAction } from "./workspaces/updateWorkspaceName.action";
// src/lib/actions/workspaces.actions.ts
