// src/lib/actions/admin/updateUserRole.action.ts
/**
 * @file updateUserRole.action.ts
 * @description Server Action atómica y de alto privilegio para la gestión de roles.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/admin/updateUserRole.action.ts.md
 */
"use server";
import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";

import { requireAppRole } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/server";
import { type Database } from "@/lib/types/database";
import { type ActionResult } from "@/lib/validators";
import { createAuditLog, createPersistentErrorLog } from "../_helpers";

export async function updateUserRoleAction(
  userId: string,
  newRole: Database["public"]["Enums"]["app_role"]
): Promise<ActionResult<void>> {
  const roleCheck = await requireAppRole(["developer"]);
  if (!roleCheck.success) {
    return { success: false, error: roleCheck.error };
  }

  if (roleCheck.data.user.id === userId) {
    return {
      success: false,
      error:
        "ValidationErrors.admin.update_user_role_self_role_change_forbidden",
    };
  }

  try {
    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase
      .from("profiles")
      .update({ app_role: newRole })
      .eq("id", userId);

    if (error) throw error;

    revalidatePath("/dev-console/users");
    revalidateTag(`user-role:${userId}`);

    await createAuditLog("user.role_updated", {
      userId: roleCheck.data.user.id,
      targetEntityId: userId,
      targetEntityType: "user",
      metadata: { newRole },
    });

    return { success: true, data: undefined };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "updateUserRoleAction",
      error as Error,
      { userId: roleCheck.data.user.id, targetUserId: userId, newRole }
    );
    logger.error(
      `[AdminActions:updateUserRole] Error inesperado. Log ID: ${errorId}`,
      { err: error }
    );
    return {
      success: false,
      error: "ValidationErrors.admin.update_user_role_failed",
    };
  }
}
// src/lib/actions/admin/updateUserRole.action.ts
