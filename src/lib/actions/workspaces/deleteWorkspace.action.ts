// src/lib/actions/workspaces/deleteWorkspace.action.ts
/**
 * @file deleteWorkspace.action.ts
 * @description Server Action atómica para la eliminación de un workspace.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/workspaces/deleteWorkspace.action.ts.md
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ZodError } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { requireWorkspacePermission } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, DeleteWorkspaceSchema } from "@/lib/validators";

export async function deleteWorkspaceAction(
  formData: FormData
): Promise<ActionResult<{ messageKey: string }>> {
  const rawData = Object.fromEntries(formData);
  try {
    const { workspaceId } = DeleteWorkspaceSchema.parse(rawData);
    const permissionCheck = await requireWorkspacePermission(workspaceId, [
      "owner",
    ]);
    if (!permissionCheck.success) return permissionCheck;

    const { user } = permissionCheck.data;

    const supabase = createClient();
    const { data: members, error: membersError } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspaceId);
    if (membersError) throw membersError;

    const ownerCount = members.filter((m) => m.role === "owner").length;
    if (members.length > 1 && ownerCount === 1) {
      return {
        success: false,
        error: "ValidationErrors.workspaces.delete_last_owner_cannot_delete",
      };
    }

    const { error } = await supabase
      .from("workspaces")
      .delete()
      .eq("id", workspaceId);
    if (error) throw error;

    await createAuditLog("workspace.deleted", {
      userId: user.id,
      targetEntityId: workspaceId,
      targetEntityType: "workspace",
    });

    const cookieStore = cookies();
    if (cookieStore.get("active_workspace_id")?.value === workspaceId) {
      cookieStore.delete("active_workspace_id");
    }

    revalidatePath("/dashboard", "layout");
    return {
      success: true,
      data: { messageKey: "ValidationErrors.workspaces.delete_success" },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    const workspaceId = rawData.workspaceId as string | undefined;
    await createPersistentErrorLog("deleteWorkspaceAction", error as Error, {
      workspaceId,
      payload: rawData,
    });
    return {
      success: false,
      error: "ValidationErrors.workspaces.delete_failed",
    };
  }
}
// src/lib/actions/workspaces/deleteWorkspace.action.ts
