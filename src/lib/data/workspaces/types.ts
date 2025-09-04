// src/lib/data/workspaces/types.ts
/**
 * @file types.ts
 * @description Aparato de contrato de datos y SSoT para la entidad 'workspaces'.
 *              Centraliza todas las definiciones de tipo necesarias para las
 *              operaciones de datos del módulo de workspaces.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { type Tables } from "@/lib/types/database";

export type Workspace = Tables<"workspaces">;

// Definición de SSoT para un miembro de workspace, incluyendo su perfil y rol.
export type WorkspaceMember = Tables<"workspace_members"> & {
  profiles: Tables<"profiles"> | null;
  workspace_roles: { name: string } | null;
};
// src/lib/data/workspaces/types.ts
