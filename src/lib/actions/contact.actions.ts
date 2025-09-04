// src/lib/actions/contact.actions.ts
/**
 * @file contact.actions.ts
 * @description Módulo de Server Actions de gestión de contacto. Refactorizado
 *              para cumplir con el contrato de errores soberanos (AD-004) y
 *              la observabilidad completa.
 * @author Raz Podesta - MetaShark Tech
 * @version 3.0.0
 * Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { z, ZodError } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
  EmailService,
} from "@/lib/actions/_helpers";
import { logger } from "@/lib/logger";
import {
  type ActionResult,
  EmailSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

const ContactFormServerSchema = z.object({
  name: z.string().min(2, { message: "contact_form.name_too_short" }),
  email: EmailSchema,
  inquiryType: z.enum(["sales", "support", "general"], {
    errorMap: () => ({
      message: "contact_form.inquiry_type_invalid",
    }),
  }),
  message: z.string().min(10, { message: "contact_form.message_too_short" }),
});

/**
 * @public
 * @async
 * @function sendContactFormAction
 * @description Procesa el envío del formulario de contacto.
 * @param {unknown} prevState - El estado anterior del formulario.
 * @param {FormData} formData - Los datos del formulario de contacto.
 * @returns {Promise<ActionResult<{ messageKey: ValidationErrorKey }>>} El resultado de la operación.
 */
export async function sendContactFormAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<{ messageKey: ValidationErrorKey }>> {
  const rawData = Object.fromEntries(formData.entries());
  logger.trace(
    { rawData },
    "[ContactAction] Iniciando procesamiento de formulario."
  );

  try {
    const parsedData = ContactFormServerSchema.parse(rawData);
    const { name, email, inquiryType, message } = parsedData;

    // Lógica de servicio (actualmente simulada)
    const emailResult = await EmailService.sendPasswordResetEmail(
      email,
      message
    );

    if (!emailResult.success) {
      throw new Error("Email service failed");
    }

    await createAuditLog("contact.form_submitted", {
      metadata: { name, email, inquiryType },
    });

    return {
      success: true,
      data: { messageKey: "contact_form.success_toast" as ValidationErrorKey },
    };
  } catch (error) {
    let errorKey: ValidationErrorKey = "contact_form.send_email_failed";

    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      errorKey = firstError.message as ValidationErrorKey;
      logger.warn(
        { errors: error.flatten() },
        "[ContactAction] Datos de formulario de contacto inválidos."
      );
    }

    const errorId = await createPersistentErrorLog(
      "sendContactFormAction",
      error as Error,
      { payload: rawData }
    );
    logger.error({ err: error, errorId }, `[ContactAction] Error inesperado.`);

    return { success: false, error: errorKey };
  }
}
// src/lib/actions/contact.actions.ts
