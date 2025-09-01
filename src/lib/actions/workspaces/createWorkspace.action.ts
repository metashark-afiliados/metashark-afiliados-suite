// src/lib/actions/workspaces/createWorkspace.action.ts
/**
 * @file createWorkspace.action.ts
 * @description Server Action atómica para la creación de un nuevo workspace.
 *              ADVERTENCIA: La implementación actual no es transaccional y presenta
 *              un riesgo de inconsistencia de datos. Debe ser migrada a una RPC.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/workspaces/createWorkspace.action.ts.md
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
  getAuthenticatedUser,
} from "@/lib/actions/_helpers";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, CreateWorkspaceSchema } from "@/lib/validators";

export async function createWorkspaceAction(
  formData: FormData
): Promise<ActionResult<{ id: string; messageKey: string }>> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  const rawData = Object.fromEntries(formData);
  try {
    const { workspaceName } = CreateWorkspaceSchema.parse(rawData);

    const supabase = createClient();
    const { data: newWorkspace, error: creationError } = await supabase
      .from("workspaces")
      .insert({ name: workspaceName, owner_id: user.id })
      .select("id")
      .single();

    if (creationError) throw creationError;

    // Asignar rol de 'owner'. En una DB relacional, se buscaría el ID del rol 'owner'.
    const { error: memberError } = await supabase
      .from("workspace_members")
      .insert({
        workspace_id: newWorkspace.id,
        user_id: user.id,
        role: "owner",
      });

    if (memberError) {
      // Rollback manual (anti-patrón)
      await supabase.from("workspaces").delete().eq("id", newWorkspace.id);
      logger.error(
        `[WorkspacesAction] Rollback: Fallo al añadir miembro para el nuevo workspace ${newWorkspace.id}.`,
        memberError
      );
      throw memberError;
    }

    await createAuditLog("workspace_created", {
      userId: user.id,
      targetEntityId: newWorkspace.id,
      targetEntityType: "workspace",
      metadata: { workspaceName },
    });
    revalidatePath("/dashboard", "layout");
    return {
      success: true,
      data: {
        id: newWorkspace.id,
        messageKey: "ValidationErrors.workspaces.create_success",
      },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    await createPersistentErrorLog("createWorkspaceAction", error as Error, {
      userId: user.id,
      payload: rawData,
    });
    return {
      success: false,
      error: "ValidationErrors.workspaces.create_failed",
    };
  }
}
// src/lib/actions/workspaces/createWorkspace.action.ts
