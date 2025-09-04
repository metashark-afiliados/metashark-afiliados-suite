// src/lib/actions/newsletter.actions.ts
/**
 * @file src/lib/actions/newsletter.actions.ts
 * @description Aparato de acción atómico para gestionar las suscripciones a la newsletter.
 *              Refactorizado a un estándar de élite para cumplir con el contrato de
 *              errores soberanos y la observabilidad canónica.
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
"use server";
import "server-only";

import { ZodError } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  EmailSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function subscribeToNewsletterAction
 * @description Añade un nuevo correo electrónico a la lista de suscripciones de la newsletter.
 * @param {unknown} prevState - Estado anterior, requerido por `useFormState`.
 * @param {FormData} formData - Datos del formulario que contienen el 'email'.
 * @returns {Promise<ActionResult<{ messageKey: ValidationErrorKey }>>} El resultado de la operación.
 */
export async function subscribeToNewsletterAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<{ messageKey: ValidationErrorKey }>> {
  const emailToSubscribe = formData.get("email");
  const context = { payload: { email: emailToSubscribe } };

  try {
    const email = EmailSchema.parse(emailToSubscribe);
    context.payload.email = email; // Usar el email validado

    logger.trace(
      context,
      "[NewsletterAction] Iniciando intento de suscripción."
    );

    const supabase = createClient();
    const { error } = await supabase
      .from("subscribers")
      .insert({ email, source: "bottom_cta_form" });

    if (error) {
      if (error.code === "23505") {
        // Error de violación de unicidad
        logger.info(
          context,
          "[NewsletterAction] Intento de suscripción duplicado."
        );
        return {
          success: true,
          data: { messageKey: "newsletter.success_duplicate" },
        };
      }
      // Para otros errores de DB, lanzar para que el catch principal los maneje.
      throw error;
    }

    await createAuditLog("newsletter.subscribed", {
      metadata: { email, source: "bottom_cta_form" },
    });

    logger.info(
      context,
      "[NewsletterAction] Nuevo suscriptor añadido con éxito."
    );
    return {
      success: true,
      data: { messageKey: "newsletter.success_new" },
    };
  } catch (error) {
    let errorKey: ValidationErrorKey = "generic.error_server_generic";

    if (error instanceof ZodError) {
      errorKey = "newsletter.error_invalid_email";
      logger.warn(
        { errors: error.flatten(), ...context },
        "[NewsletterAction] Intento de suscripción con email inválido."
      );
    }

    // Errores de Zod no son críticos del sistema, no se persisten.
    if (!(error instanceof ZodError)) {
      const errorId = await createPersistentErrorLog(
        "subscribeToNewsletterAction",
        error as Error,
        context
      );
      logger.error(
        { err: error, errorId, ...context },
        "[NewsletterAction] Fallo en la acción."
      );
    }

    return {
      success: false,
      error: errorKey,
    };
  }
}
// src/lib/actions/newsletter.actions.ts
