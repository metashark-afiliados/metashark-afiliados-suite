// src/lib/actions/password/requestPasswordReset.action.ts
/**
 * @file requestPasswordReset.action.ts
 * @description Server Action atómica para el inicio del flujo de recuperación
 *              de contraseña. Refactorizada para alinear su contrato de retorno
 *              explícitamente con las expectativas de `useFormState`.
 * @author L.I.A. Legacy
 * @version 5.0.0
 * @see .docs-espejo/lib/actions/password/requestPasswordReset.action.ts.md
 */
"use server";
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  checkRateLimit,
  createAuditLog,
  createPersistentErrorLog,
  EmailService,
} from "@/lib/actions/_helpers";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/server";
import { type ActionResult, EmailSchema } from "@/lib/validators";

type RequestPasswordResetState = ActionResult<null>;

/**
 * @public
 * @async
 * @function requestPasswordResetAction
 * @description Inicia el flujo de restablecimiento de contraseña. Por seguridad,
 *              siempre redirige a una página de notificación.
 * @param {unknown} prevState - Requerido por `useFormState`.
 * @param {FormData} formData - Los datos del formulario.
 * @returns {Promise<RequestPasswordResetState>} Retorna un ActionResult solo
 *          en caso de error, de lo contrario redirige.
 */
export async function requestPasswordResetAction(
  prevState: unknown,
  formData: FormData
): Promise<RequestPasswordResetState> {
  const ip = headers().get("x-forwarded-for");
  const limit = await checkRateLimit(ip, "password_reset");

  if (!limit.success) {
    return {
      success: false,
      error: "generic.error_too_many_requests",
    };
  }

  const rawData = Object.fromEntries(formData.entries());
  const context = { payload: rawData, ip };

  try {
    const emailResult = EmailSchema.safeParse(rawData.email);

    if (!emailResult.success) {
      logger.warn(
        { email: rawData.email, ...context },
        "[PasswordActions] Intento de reseteo con email inválido."
      );
      redirect("/auth-notice?message=check-email-for-reset");
    }

    const email = emailResult.data;
    const adminSupabase = createAdminClient();
    const origin = headers().get("origin");

    const { data, error } = await adminSupabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: `${origin}/reset-password` },
    });

    if (error) {
      logger.trace(
        { email, err: error, ...context },
        "[PasswordActions] No se pudo generar enlace (posible usuario inexistente)."
      );
    } else {
      await EmailService.sendPasswordResetEmail(
        email,
        data.properties.action_link
      );
    }

    await createAuditLog("password_reset.request_sent", {
      metadata: { targetEmail: email, ipAddress: ip },
    });

    redirect("/auth-notice?message=check-email-for-reset");
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "requestPasswordResetAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      "[PasswordActions] Error inesperado en reseteo."
    );
    return {
      success: false,
      error: "generic.error_server_generic",
    };
  }
}
// src/lib/actions/password/requestPasswordReset.action.ts
