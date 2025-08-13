// src/lib/actions/newsletter.actions.ts
/**
 * @file src/lib/actions/newsletter.actions.ts
 * @description Aparato de acción atómico para gestionar las suscripciones a la newsletter.
 *              Ha sido refactorizado a un estándar de élite para devolver claves de
 *              internacionalización en lugar de texto codificado, cumpliendo
 *              con el mandato de Full i18n.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use server";
import "server-only";

import { ZodError } from "zod";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, EmailSchema } from "@/lib/validators";

import { createAuditLog } from "./_helpers";

/**
 * @public
 * @async
 * @function subscribeToNewsletterAction
 * @description Añade un nuevo correo electrónico a la lista de suscripciones de la newsletter.
 * @param {unknown} prevState - Estado anterior, requerido por `useFormState`.
 * @param {FormData} formData - Datos del formulario que contienen el 'email'.
 * @returns {Promise<ActionResult<{ messageKey: string }>>} El resultado de la operación,
 *          conteniendo una clave de i18n para el feedback al usuario.
 */
export async function subscribeToNewsletterAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<{ messageKey: string }>> {
  try {
    const email = EmailSchema.parse(formData.get("email"));

    logger.trace(`[NewsletterAction] Intento de suscripción para: ${email}`);

    const supabase = createClient();
    const { error } = await supabase
      .from("newsletter_subscriptions")
      .insert({ email, source: "bottom_cta_form" });

    if (error) {
      if (error.code === "23505") {
        logger.warn(`[NewsletterAction] Intento de suscripción duplicado para: ${email}`);
        return {
          success: true,
          data: { messageKey: "Newsletter.success_duplicate" },
        };
      }
      logger.error(`[NewsletterAction] Error de base de datos al suscribir a ${email}`, error);
      return { success: false, error: "Newsletter.error_server" };
    }

    await createAuditLog("newsletter.subscribed", {
      metadata: { email, source: "bottom_cta_form" },
    });

    logger.info(`[NewsletterAction] Nuevo suscriptor añadido: ${email}`);
    return {
      success: true,
      data: { messageKey: "Newsletter.success_new" },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("[NewsletterAction] Intento de suscripción con email inválido.", {
        errors: error.flatten(),
      });
      return { success: false, error: "Newsletter.error_invalid_email" };
    }
    logger.error("[NewsletterAction] Error inesperado", error);
    return { success: false, error: "Newsletter.error_unexpected" };
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Full Internacionalización**: ((Implementada)) La Server Action ahora devuelve claves de i18n (ej. `Newsletter.success_new`) en lugar de texto codificado. Esto desacopla la lógica de servidor de la capa de presentación y permite que la UI muestre mensajes traducidos.
 *
 * @subsection Melhorias Futuras
 * 1. **Fuente de Suscripción Dinámica**: ((Vigente)) La `source` está codificada como 'bottom_cta_form'. La acción podría aceptar un parámetro adicional para registrar la fuente de la suscripción de forma dinámica.
 *
 * =====================================================================
 */
// src/lib/actions/newsletter.actions.ts