// src/lib/actions/contact.actions.ts
/**
 * @file contact.actions.ts
 * @description Server Action atómica para el envío de formularios de contacto.
 *              Ha sido refactorizada para corregir un error de tipo en el
 *              registro de errores persistentes, garantizando la correcta
 *              serialización de los datos del formulario.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.1.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { ZodError, z } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
  EmailService,
} from "@/lib/actions/_helpers";
import { logger } from "@/lib/logging";
import { type ActionResult, EmailSchema } from "@/lib/validators";

const ContactFormServerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "ValidationErrors.contact_form.name_too_short" }),
  email: EmailSchema,
  inquiryType: z.enum(["sales", "support", "general"], {
    errorMap: () => ({
      message: "ValidationErrors.contact_form.inquiry_type_invalid",
    }),
  }),
  message: z
    .string()
    .min(10, { message: "ValidationErrors.contact_form.message_too_short" }),
});

/**
 * @public
 * @async
 * @function sendContactFormAction
 * @description Procesa el envío del formulario de contacto.
 * @param {unknown} prevState - El estado anterior del formulario.
 * @param {FormData} formData - Los datos del formulario de contacto.
 * @returns {Promise<ActionResult<{ messageKey: string }>>} El resultado de la operación.
 */
export async function sendContactFormAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<{ messageKey: string }>> {
  const rawData = Object.fromEntries(formData.entries());
  logger.trace(
    "[ContactAction] Iniciando procesamiento de formulario de contacto.",
    { rawData }
  );

  try {
    const parsedData = ContactFormServerSchema.parse(rawData);
    const { name, email, inquiryType, message } = parsedData;

    // Simulación de envío de email.
    const emailSubject = `Nueva consulta de Contacto: ${inquiryType}`;
    const emailBody = `Nombre: ${name}\nEmail: ${email}\nMensaje:\n${message}`;

    const emailResult = await EmailService.sendPasswordResetEmail(
      email,
      emailBody
    );

    if (!emailResult.success) {
      logger.error("[ContactAction] Fallo en el servicio de email simulado.", {
        email,
      });
      await createPersistentErrorLog(
        "sendContactFormAction.email_service_failed",
        new Error("Email service failed"),
        { payload: parsedData }
      );
      return {
        success: false,
        error: "ValidationErrors.contact_form.send_email_failed",
      };
    }

    await createAuditLog("contact.form_submitted", {
      metadata: { name, email, inquiryType },
    });

    return {
      success: true,
      data: { messageKey: "ValidationErrors.contact_form.success_toast" },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn(
        "[ContactAction] Datos de formulario de contacto inválidos.",
        { errors: error.flatten() }
      );
      return {
        success: false,
        error:
          error.errors[0]?.message ||
          "ValidationErrors.contact_form.invalid_data",
      };
    }
    await createPersistentErrorLog(
      "sendContactFormAction.unexpected",
      error as Error,
      { payload: rawData } // Se pasa el objeto serializable rawData
    );
    logger.error(
      "[ContactAction] Error inesperado al procesar formulario de contacto.",
      { error }
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
 * @version 1.1.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Integración con Proveedor de Email Real:** Reemplazar la simulación de `EmailService` con una integración real (ej., Resend, Postmark) para el envío de correos electrónicos transaccionales.
 * 2. ((Vigente)) **Almacenamiento de Consultas en DB:** Para una gestión de soporte de élite, añadir lógica para guardar las consultas de contacto en una tabla `tickets` en la base de datos, en lugar de solo enviarlas por email.
 *
 * =====================================================================
 */
// src/lib/actions/contact.actions.ts
