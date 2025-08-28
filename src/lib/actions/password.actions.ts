// src/lib/actions/password.actions.ts
/**
 * @file password.actions.ts
 * @description Aparato canónico para las Server Actions del ciclo de vida de la contraseña.
 *              Contiene la lógica segura para solicitar un restablecimiento y para
 *              actualizar la contraseña, implementando un flujo de seguridad
 *              anti-enumeración y utilizando helpers de limitación de tasa y auditoría.
 *              Ha sido refactorizado holísticamente para **centralizar todos
 *              los mensajes de error en el namespace `shared.ValidationErrors`**,
 *              y registrar errores persistentes, mejorando la observabilidad y la consistencia.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
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
  createPersistentErrorLog, // Importar para errores inesperados
} from "@/lib/actions/_helpers";
import { logger } from "@/lib/logging";
import { createAdminClient, createClient } from "@/lib/supabase/server";
// --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Zod Schema con claves i18n ---
import { EmailSchema } from "@/lib/validators/schemas"; // EmailSchema ya tiene clave i18n
import { type ActionResult } from "@/lib/validators";

// Esquema de validación para el restablecimiento de contraseña, usando claves de i18n
const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "ValidationErrors.password_too_short" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "ValidationErrors.passwords_do_not_match",
    path: ["confirmPassword"],
  });
// --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---

type RequestPasswordResetState = ActionResult<null>;
type UpdatePasswordFormState = ActionResult<null>;

/**
 * @public
 * @async
 * @function requestPasswordResetAction
 * @description Inicia el flujo de restablecimiento de contraseña. Es seguro contra
 *              ataques de enumeración de usuarios. Siempre redirige a una página de aviso.
 *              Devuelve claves de i18n para los errores.
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
    // checkRateLimit ya devuelve una clave de i18n o null.
    return {
      success: false,
      error: limit.error || "ValidationErrors.error_server_generic",
    };
  }

  const emailResult = EmailSchema.safeParse(formData.get("email"));
  if (!emailResult.success) {
    // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
    logger.warn(
      "[PasswordActions:requestPasswordResetAction] Intento de restablecimiento con email inválido.",
      {
        email: formData.get("email"),
      }
    );
    return {
      success: false,
      error: "ValidationErrors.password_reset_invalid_email",
    };
    // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
  }
  const email = emailResult.data;

  const adminSupabase = createAdminClient();
  const origin = headers().get("origin");

  try {
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
        `[PasswordActions:requestPasswordResetAction] Error al generar link de recuperación para ${email}`,
        error
      );
      // No devolver error al cliente para evitar enumeración.
      // Solo registramos y redirigimos a la página de aviso.
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
    const errorId = await createPersistentErrorLog(
      "requestPasswordResetAction.unexpected",
      error as Error,
      { email, ip }
    );
    logger.error(
      `[PasswordActions:requestPasswordResetAction] Error inesperado. Log ID: ${errorId}`,
      { error }
    );
    return { success: false, error: "ValidationErrors.error_server_generic" };
  }
}

/**
 * @public
 * @async
 * @function updatePasswordAction
 * @description Completa el flujo de restablecimiento, actualizando la contraseña del
 *              usuario. Valida que el usuario tenga una sesión de recuperación válida.
 *              Devuelve claves de i18n para los errores.
 * @param {unknown} prevState - Estado anterior del formulario.
 * @param {FormData} formData - Datos del formulario con la nueva contraseña.
 * @returns {Promise<UpdatePasswordFormState>} El nuevo estado del formulario.
 */
export async function updatePasswordAction(
  prevState: unknown,
  formData: FormData
): Promise<UpdatePasswordFormState> {
  try {
    const validation = ResetPasswordSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (!validation.success) {
      const errorMessage =
        validation.error.errors[0].message ||
        "ValidationErrors.password_update_invalid_data";
      return { success: false, error: errorMessage };
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: validation.data.password,
    });

    if (error) {
      logger.error(
        `[PasswordActions:updatePasswordAction] Error al actualizar la contraseña`,
        {
          message: error.message,
        }
      );
      // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Errores centralizados ---
      if (error.message.includes("token has expired")) {
        return {
          success: false,
          error: "ValidationErrors.password_update_expired_link",
        };
      }
      return {
        success: false,
        error: "ValidationErrors.password_update_failed",
      };
      // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await createAuditLog("password_reset_success", { userId: user.id });
      await supabase.auth.signOut({ scope: "others" }); // Desconectar otras sesiones
    }

    return { success: true, data: null };
  } catch (error) {
    // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Manejo de errores inesperados ---
    const errorId = await createPersistentErrorLog(
      "updatePasswordAction.unexpected",
      error as Error,
      { payload: Object.fromEntries(formData) }
    );
    logger.error(
      `[PasswordActions:updatePasswordAction] Error inesperado. Log ID: ${errorId}`,
      {
        error: error instanceof Error ? error.message : String(error),
      }
    );
    return { success: false, error: "ValidationErrors.error_server_generic" };
    // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Centralización de Errores (SSoT)**: ((Implementada)) Todos los mensajes de error `hardcodeados` en `requestPasswordResetAction` y `updatePasswordAction`, incluyendo los del `ResetPasswordSchema` de Zod, ahora utilizan claves del namespace `shared.ValidationErrors`. Esto consolida la "Única Fuente de Verdad" para los errores de contraseñas.
 * 2. **Clasificación por Dominio Formalizada**: ((Implementada)) La adición de errores prefijados con `password_` formaliza el patrón de clasificación de errores por dominio, mejorando la organización y mantenibilidad.
 * 3. **Integración con `checkRateLimit`**: ((Implementada)) La acción `requestPasswordResetAction` ahora consume el mensaje de error de `checkRateLimit` como una clave de i18n.
 * 4. **Full Observabilidad Mejorada**: ((Implementada)) Se han añadido `logger.warn` y `logger.error` contextuales en cada punto de fallo, y se ha integrado `createPersistentErrorLog` para los errores inesperados, proporcionando una trazabilidad completa.
 * 5. **No Regresión Funcional**: ((Implementada)) La lógica de negocio principal de cada acción se mantiene intacta, con la mejora centrada en la resiliencia y la internacionalización.
 *
 * @subsection Melhorias Futuras
 * 1. **Notificación de Cambio**: ((Vigente)) Después de una actualización exitosa, enviar un email al usuario informándole que su contraseña ha sido cambiada, como medida de seguridad.
 * 2. **Pruebas Unitarias de `ResetPasswordSchema`**: ((Vigente)) Se debe añadir un arnés de pruebas unitarias para `ResetPasswordSchema` para validar explícitamente que los mensajes de error de Zod son correctos y que referencian las claves de `ValidationErrors`.
 *
 * =====================================================================
 */
