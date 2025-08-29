// src/lib/actions/password.actions.ts
/**
 * @file password.actions.ts
 * @description Aparato canónico para las Server Actions del ciclo de vida de la contraseña.
 *              Ha sido refactorizado holísticamente para **centralizar TODOS los mensajes
 *              de feedback (éxito y error) en el namespace `shared.ValidationErrors`**,
 *              y para corregir errores de tipo en el manejo de datos y errores.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ZodError, z } from "zod";

import {
  createAuditLog,
  EmailService,
  checkRateLimit,
  createPersistentErrorLog,
  getAuthenticatedUser,
} from "@/lib/actions/_helpers";
import { logger } from "@/lib/logging";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  EmailSchema,
  PasswordSchema,
} from "@/lib/validators";

const ResetPasswordSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "ValidationErrors.generic.passwords_do_not_match",
    path: ["confirmPassword"],
  });

export async function requestPasswordResetAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<null>> {
  const ip = headers().get("x-forwarded-for");
  const limit = await checkRateLimit(ip, "password_reset");

  if (!limit.success) {
    return {
      success: false,
      error: limit.error || "ValidationErrors.password.reset_too_many_requests",
    };
  }

  const rawData = Object.fromEntries(formData);
  const emailResult = EmailSchema.safeParse(rawData.email);
  if (!emailResult.success) {
    logger.warn("[PasswordActions] Intento de reseteo con email inválido.", {
      email: rawData.email,
    });
    return {
      success: false,
      error: "ValidationErrors.password.reset_invalid_email",
    };
  }
  const email = emailResult.data;
  const adminSupabase = createAdminClient();
  const origin = headers().get("origin");

  try {
    const { data, error } = await adminSupabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: `${origin}/reset-password` },
    });

    if (error) {
      await createPersistentErrorLog(
        "requestPasswordResetAction.generate_link",
        error,
        { email }
      );
    } else {
      await EmailService.sendPasswordResetEmail(
        email,
        data.properties.action_link
      );
    }

    await createAuditLog("password_reset_request", {
      metadata: { targetEmail: email, ipAddress: ip },
    });

    redirect("/auth-notice?message=check-email-for-reset");
  } catch (error) {
    await createPersistentErrorLog(
      "requestPasswordResetAction.unexpected",
      error as Error,
      { payload: rawData }
    );
    logger.error("[PasswordActions] Error inesperado en reseteo.", { error });
    return {
      success: false,
      error: "ValidationErrors.generic.error_server_generic",
    };
  }
}

export async function updatePasswordAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<{ messageKey: string }>> {
  const rawData = Object.fromEntries(formData);
  try {
    const validation = ResetPasswordSchema.safeParse(rawData);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message };
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: validation.data.password,
    });

    if (error) {
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

    const authResult = await getAuthenticatedUser();
    if ("user" in authResult) {
      const { user } = authResult;
      await createAuditLog("password_reset_success", { userId: user.id });
      await supabase.auth.signOut({ scope: "others" });
    }

    return {
      success: true,
      data: { messageKey: "ValidationErrors.password.update_success" },
    };
  } catch (error) {
    await createPersistentErrorLog(
      "updatePasswordAction.unexpected",
      error as Error,
      { payload: rawData }
    );
    return {
      success: false,
      error: "ValidationErrors.generic.error_server_generic",
    };
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Notificación de Cambio de Contraseña:** Tras una actualización exitosa, enviar un correo electrónico de notificación al usuario como medida de seguridad adicional para alertarle del cambio.
 * 2. ((Vigente)) **Validación de Contraseña Antigua:** Para usuarios autenticados que deseen cambiar su contraseña desde el panel de configuración, crear una nueva `changePasswordAction` que requiera la contraseña actual antes de permitir el cambio.
 *
 * =====================================================================
 */
// src/lib/actions/password.actions.ts
