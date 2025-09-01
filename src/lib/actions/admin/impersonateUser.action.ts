// src/lib/actions/admin/impersonateUser.action.ts
/**
 * @file impersonateUser.action.ts
 * @description Server Action atómica y de alto privilegio para la suplantación de usuarios.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/admin/impersonateUser.action.ts.md
 */
"use server";
import "server-only";

import { requireAppRole } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/server";
import { type ActionResult } from "@/lib/validators";
import { createAuditLog } from "../_helpers";

export async function impersonateUserAction(
  formData: FormData
): Promise<ActionResult<{ signInLink: string }>> {
  const roleCheck = await requireAppRole(["developer"]);
  if (!roleCheck.success) {
    return { success: false, error: roleCheck.error };
  }

  const userId = formData.get("userId") as string;
  if (!userId) {
    logger.warn("[AdminActions:impersonate] Impersonation: userId is missing.");
    return {
      success: false,
      error: "ValidationErrors.admin.impersonation_user_id_missing",
    };
  }

  if (roleCheck.data.user.id === userId) {
    return {
      success: false,
      error: "ValidationErrors.admin.impersonation_self_impersonation_forbidden",
    };
  }

  const adminSupabase = createAdminClient();
  const { data: userData, error: userError } =
    await adminSupabase.auth.admin.getUserById(userId);

  if (userError || !userData.user) {
    logger.error(`[AdminActions:impersonate] Error al obtener usuario ${userId}`, {
      err: userError,
    });
    return {
      success: false,
      error: "ValidationErrors.admin.impersonation_user_not_found",
    };
  }

  const { data, error } = await adminSupabase.auth.admin.generateLink({
    type: "magiclink",
    email: userData.user.email!,
  });

  if (error) {
    logger.error(`[AdminActions:impersonate] Error al generar link para ${userId}`, {
      err: error,
    });
    return {
      success: false,
      error: "ValidationErrors.admin.impersonation_link_generation_failed",
    };
  }

  await createAuditLog("user.impersonated", {
    userId: roleCheck.data.user.id,
    targetEntityId: userId,
    targetEntityType: "user",
    metadata: { impersonatedEmail: userData.user.email },
  });

  return { success: true, data: { signInLink: data.properties.action_link } };
}
// src/lib/actions/admin/impersonateUser.action.ts