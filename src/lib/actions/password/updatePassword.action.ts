// src/lib/actions/password/updatePassword.action.ts
/**
 * @file updatePassword.action.ts
 * @description Server Action atómica para actualizar la contraseña del usuario,
 *              generalmente como el paso final del flujo de recuperación.
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/password/updatePassword.action.ts.md
 */
"use server";
import "server-only";

import { z, ZodError } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
  getAuthenticatedUser,
} from "@/lib/actions/_helpers";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, PasswordSchema } from "@/lib/validators";

const ResetPasswordSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "ValidationErrors.generic.passwords_do_not_match",
    path: ["confirmPassword"],
  });

export async function updatePasswordAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<{ messageKey: string }>> {
  const rawData = Object.fromEntries(formData);
  try {
    const validation = ResetPasswordSchema.safeParse(rawData);
    if (!validation.success) {
      logger.warn("[PasswordActions:Update] Validación de payload fallida.", {
        errors: validation.error.flatten(),
      });
      return { success: false, error: validation.error.errors[0].message };
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: validation.data.password,
    });

    if (error) {
      logger.error(
        "[PasswordActions:Update] Error al actualizar contraseña en Supabase.",
        {
          errorMessage: error.message,
        }
      );
      if (error.message.includes("token has expired")) {
        return {
          success: false,
          error: "ValidationErrors.password.update_expired_link",
        };
      }
      return {
        success: false,
        error: "ValidationErrors.password.update_failed",
      };
    }

    // Efectos secundarios de seguridad
    const authResult = await getAuthenticatedUser();
    if ("user" in authResult) {
      const { user } = authResult;
      await createAuditLog("password_reset_success", { userId: user.id });
      // Cierra todas las demás sesiones para invalidar tokens potencialmente comprometidos
      await supabase.auth.signOut({ scope: "others" });
    }

    return {
      success: true,
      data: { messageKey: "ValidationErrors.password.update_success" },
    };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "updatePasswordAction.unexpected",
      error as Error,
      { payload: rawData }
    );
    logger.error(
      `[PasswordActions:Update] Error inesperado. Log ID: ${errorId}`
    );
    return {
      success: false,
      error: "ValidationErrors.generic.error_server_generic",
    };
  }
}
// src/lib/actions/password/updatePassword.action.ts
