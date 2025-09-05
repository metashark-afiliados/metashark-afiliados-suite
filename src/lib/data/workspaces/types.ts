// src/lib/data/workspaces/types.ts
/**
 * @file types.ts
 * @description Aparato de contrato de datos y SSoT para la entidad 'workspaces'.
 *              Centraliza todas las definiciones de tipo necesarias para las
 *              operaciones de datos del módulo de workspaces.
 * @author L.I.A. Legacy
 * @version 2.0.0
 * @see .docs-espejo/lib/data/workspaces/types.ts.md
 */
import { type Tables } from "@/lib/types/database";

/**
 * @public
 * @typedef Workspace
 * @description El contrato de datos para la entidad `workspaces`.
 */
export type Workspace = Tables<"workspaces">;

/**
 * @public
 * @typedef WorkspaceMember
 * @description El contrato de datos de presentación para un miembro de workspace.
 *              Es un tipo enriquecido que incluye los datos unidos de las tablas
 *              `profiles` y `workspace_roles`.
 */
export type WorkspaceMember = Tables<"workspace_members"> & {
  profiles: Pick<
    Tables<"profiles">,
    "id" | "email" | "full_name" | "avatar_url"
  > | null;
  workspace_roles: { name: string } | null;
};
// src/lib/data/workspaces/types.ts
