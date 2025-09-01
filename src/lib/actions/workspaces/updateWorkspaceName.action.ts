// src/lib/actions/workspaces/updateWorkspaceName.action.ts
/**
 * @file updateWorkspaceName.action.ts
 * @description Server Action atómica para actualizar el nombre de un workspace.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/workspaces/updateWorkspaceName.action.ts.md
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { requireWorkspacePermission } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, UpdateWorkspaceNameSchema } from "@/lib/validators";

export async function updateWorkspaceNameAction(
  workspaceId: string,
  newName: string
): Promise<ActionResult<{ messageKey: string }>> {
  const permissionCheck = await requireWorkspacePermission(workspaceId, [
    "owner",
    "admin",
  ]);
  if (!permissionCheck.success) return permissionCheck;

  const { user } = permissionCheck.data;

  try {
    const { name } = UpdateWorkspaceNameSchema.parse({ name: newName });
    const supabase = createClient();
    const { error } = await supabase
      .from("workspaces")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", workspaceId);
    if (error) throw error;

    await createAuditLog("workspace.name_updated", {
      userId: user.id,
      targetEntityId: workspaceId,
      targetEntityType: "workspace",
      metadata: { newName: name },
    });
    revalidatePath("/dashboard", "layout");
    return {
      success: true,
      data: { messageKey: "ValidationErrors.workspaces.update_name_success" },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    await createPersistentErrorLog(
      "updateWorkspaceNameAction",
      error as Error,
      { userId: user.id, workspaceId, newName }
    );
    return {
      success: false,
      error: "ValidationErrors.workspaces.update_name_failed",
    };
  }
}
// src/lib/actions/workspaces/updateWorkspaceName.action.ts
