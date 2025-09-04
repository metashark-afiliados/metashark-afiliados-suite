// src/lib/actions/contact/send.action.ts
/**
 * @file send.action.ts
 * @description Server Action atómica para el envío del formulario de contacto.
 *              Alineada con el contrato de errores soberanos y la observabilidad.
 * @author L.I.A. Legacy
 * @version 1.0.0
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

export async function sendContactFormAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<{ messageKey: ValidationErrorKey }>> {
  const rawData = Object.fromEntries(formData.entries());
  const context = { payload: rawData };
  logger.trace(
    context,
    "[ContactAction] Iniciando procesamiento de formulario."
  );

  try {
    const parsedData = ContactFormServerSchema.parse(rawData);
    const { name, email, inquiryType, message } = parsedData;

    // Simulación del servicio de email
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
      data: { messageKey: "contact_form.success_toast" },
    };
  } catch (error) {
    let errorKey: ValidationErrorKey = "contact_form.send_email_failed";

    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      errorKey = firstError.message as ValidationErrorKey;
      logger.warn(
        { errors: error.flatten(), ...context },
        "[ContactAction] Datos de formulario de contacto inválidos."
      );
    }

    if (!(error instanceof ZodError)) {
      const errorId = await createPersistentErrorLog(
        "sendContactFormAction",
        error as Error,
        context
      );
      logger.error(
        { err: error, errorId, ...context },
        `[ContactAction] Error inesperado.`
      );
    }

    return { success: false, error: errorKey };
  }
}
// src/lib/actions/contact/send.action.ts
