// src/lib/actions/password/requestPasswordReset.action.ts
/**
 * @file requestPasswordReset.action.ts
 * @description Server Action atómica para el inicio del flujo de recuperación de contraseña.
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 1.0.0
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
import { logger } from "@/lib/logging";
import { createAdminClient } from "@/lib/supabase/server";
import { type ActionResult, EmailSchema } from "@/lib/validators";

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
    // Se redirige igualmente para no revelar si el formato es el problema.
    redirect("/auth-notice?message=check-email-for-reset");
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

    // Seguridad por oscuridad: No revelamos si el usuario existe o no.
    // Si hay un error, lo registramos, pero el flujo de UI es el mismo.
    if (error) {
      // Este error puede ocurrir si el usuario no existe, lo cual es esperado.
      // Lo registramos como `trace` para no generar ruido en producción.
      logger.trace(
        `[PasswordActions] No se pudo generar el enlace de reseteo para ${email}. Puede que el usuario no exista.`,
        { error: error.message }
      );
    } else {
      // Solo enviamos el email si el enlace se generó correctamente.
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
// src/lib/actions/password/requestPasswordReset.action.ts
