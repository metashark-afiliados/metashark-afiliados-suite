// src/lib/actions/workspaces/updateWorkspaceName.action.ts
/**
 * @file updateWorkspaceName.action.ts
 * @description Server Action atómica para actualizar el nombre de un workspace.
 *              Refactorizada para adherirse al contrato `ActionResult` blindado.
 * @author RaZ Podestá - MetaShark Tech
 * @version 2.0.0
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
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  UpdateWorkspaceNameSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

export async function updateWorkspaceNameAction(
  workspaceId: string,
  newName: string
): Promise<ActionResult<{ messageKey: ValidationErrorKey }>> {
  const permissionCheck = await requireWorkspacePermission(workspaceId, [
    "owner",
    "admin",
  ]);
  if (!permissionCheck.success) {
    return {
      success: false,
      error: "workspaces.update_name_permission_denied",
    };
  }

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
      data: { messageKey: "workspaces.update_name_success" },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: firstError.message as ValidationErrorKey,
      };
    }
    await createPersistentErrorLog(
      "updateWorkspaceNameAction",
      error as Error,
      { userId: user.id, workspaceId, newName }
    );
    return {
      success: false,
      error: "workspaces.update_name_failed",
    };
  }
}
// src/lib/actions/workspaces/updateWorkspaceName.action.ts
