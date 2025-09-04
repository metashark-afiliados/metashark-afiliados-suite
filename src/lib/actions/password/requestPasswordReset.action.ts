// src/lib/actions/password/requestPasswordReset.action.ts
/**
 * @file requestPasswordReset.action.ts
 * @description Server Action atómica para el inicio del flujo de recuperación
 *              de contraseña. Refactorizada para unificar su comportamiento de
 *              redirección, mejorando la seguridad y adhiriéndose al
 *              contrato `ActionResult` y la Constitución de Observabilidad.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
"use server";
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

import {
  checkRateLimit,
  createAuditLog,
  createPersistentErrorLog,
  EmailService,
} from "@/lib/actions/_helpers";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  EmailSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function requestPasswordResetAction
 * @description Inicia el flujo de restablecimiento de contraseña. Por seguridad,
 *              siempre redirige a una página de notificación para prevenir
 *              ataques de enumeración de usuarios.
 * @param {unknown} prevState - El estado anterior, requerido por `useFormState`.
 * @param {FormData} formData - Los datos del formulario.
 * @returns {Promise<ActionResult<null>>} Retorna un ActionResult solo si falla
 *          el rate limiter o en caso de un error crítico del servidor.
 */
export async function requestPasswordResetAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<null>> {
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
      // Redirigir igualmente para no revelar el motivo del fallo.
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
