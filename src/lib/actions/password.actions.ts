// src/lib/actions/password.actions.ts
/**
 * @file password.actions.ts
 * @description Aparato canónico para las Server Actions del ciclo de vida de la contraseña.
 *              Contiene la lógica segura para solicitar un restablecimiento y para
 *              actualizar la contraseña, implementando un flujo de seguridad
 *              anti-enumeración y utilizando helpers de limitación de tasa y auditoría.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use server";
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  createAuditLog,
  EmailService,
  checkRateLimit,
} from "@/lib/actions/_helpers";
import { logger } from "@/lib/logging";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { EmailSchema } from "@/lib/validators";
import { type ActionResult } from "@/lib/validators";

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

type RequestPasswordResetState = ActionResult<null>;
type UpdatePasswordFormState = ActionResult<null>;

/**
 * @public
 * @async
 * @function requestPasswordResetAction
 * @description Inicia el flujo de restablecimiento de contraseña. Es seguro contra
 *              ataques de enumeración de usuarios. Siempre redirige a una página de aviso.
 * @param {unknown} prevState - Estado anterior del formulario, para compatibilidad con `useFormState`.
 * @param {FormData} formData - Datos del formulario que contienen el email.
 * @returns {Promise<RequestPasswordResetState>} El nuevo estado del formulario.
 */
export async function requestPasswordResetAction(
  prevState: unknown,
  formData: FormData
): Promise<RequestPasswordResetState> {
  const ip = headers().get("x-forwarded-for");
  const limit = await checkRateLimit(ip, "password_reset");

  if (!limit.success) {
    return { success: false, error: limit.error || "Demasiadas solicitudes." };
  }

  const emailResult = EmailSchema.safeParse(formData.get("email"));
  if (!emailResult.success) {
    return { success: false, error: "Por favor, introduce un email válido." };
  }
  const email = emailResult.data;

  const adminSupabase = createAdminClient();
  const origin = headers().get("origin");

  // Flujo de seguridad anti-enumeración:
  // 1. Siempre se intenta generar el enlace.
  // 2. Nunca se revela si el usuario existe o no.
  // 3. Siempre se registra el intento.
  // 4. Siempre se redirige a la misma página de éxito.
  const { data, error } = await adminSupabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: {
      redirectTo: `${origin}/reset-password`,
    },
  });

  if (error) {
    logger.error(
      `[PasswordActions] Error al generar link de recuperación para ${email}`,
      error
    );
    // No devolver error al cliente.
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
}

/**
 * @public
 * @async
 * @function updatePasswordAction
 * @description Completa el flujo de restablecimiento, actualizando la contraseña del
 *              usuario. Valida que el usuario tenga una sesión de recuperación válida.
 * @param {unknown} prevState - Estado anterior del formulario.
 * @param {FormData} formData - Datos del formulario con la nueva contraseña.
 * @returns {Promise<UpdatePasswordFormState>} El nuevo estado del formulario.
 */
export async function updatePasswordAction(
  prevState: unknown,
  formData: FormData
): Promise<UpdatePasswordFormState> {
  const validation = ResetPasswordSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!validation.success) {
    const errorMessage =
      validation.error.flatten().fieldErrors.confirmPassword?.[0] ||
      validation.error.flatten().fieldErrors.password?.[0] ||
      "Datos inválidos.";
    return { success: false, error: errorMessage };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    password: validation.data.password,
  });

  if (error) {
    logger.error(`[PasswordActions] Error al actualizar la contraseña`, {
      message: error.message,
    });
    if (error.message.includes("token has expired")) {
      return {
        success: false,
        error:
          "El enlace de reseteo ha expirado. Por favor, solicita uno nuevo.",
      };
    }
    return {
      success: false,
      error: "No fue posible actualizar la contraseña. Intente nuevamente.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await createAuditLog("password_reset_success", { userId: user.id });
    await supabase.auth.signOut({ scope: "others" });
  }

  return { success: true, data: null };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Seguridad Anti-Enumeración**: ((Implementada)) `requestPasswordResetAction` no revela la existencia de un email, una práctica de seguridad de élite.
 * 2. **Ciclo de Vida Completo**: ((Implementada)) Proporciona la lógica completa para la recuperación de contraseñas.
 * 3. **Full Observabilidad y Auditoría**: ((Implementada)) Todas las acciones son registradas con logs de error y de auditoría.
 *
 * @subsection Melhorias Futuras
 * 1. **Notificación de Cambio**: ((Vigente)) Después de una actualización exitosa, enviar un email al usuario informándole que su contraseña ha sido cambiada, como medida de seguridad.
 *
 * =====================================================================
 */
// src/lib/actions/password.actions.ts
