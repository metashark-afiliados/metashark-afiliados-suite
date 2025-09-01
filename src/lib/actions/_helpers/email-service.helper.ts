
// src/lib/actions/_helpers/email-service.helper.ts
/**
 * @file src/lib/actions/_helpers/email-service.helper.ts
 * @description Helper que abstrae y centraliza el servicio de envío de correos
 *              electrónicos transaccionales. Es una SSoT que desacopla la
 *              aplicación de la implementación específica de un proveedor de email.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 2.0.0
 * @see .docs-espejo/lib/actions/_helpers/email-service.helper.ts.md
 */
import "server-only";

import { logger } from "@/lib/logger";

/**
 * @public
 * @constant EmailService
 * @description Objeto que encapsula los métodos para el envío de diferentes
 *              tipos de correos transaccionales. Actualmente es una simulación
 *              de alta fidelidad para desarrollo.
 */
export const EmailService = {
  /**
   * @public
   * @async
   * @function sendPasswordResetEmail
   * @description Envía un correo electrónico de restablecimiento de contraseña.
   * @param {string} email - La dirección de correo electrónico del destinatario.
   * @param {string} resetLink - El enlace único y seguro para el restablecimiento.
   * @returns {Promise<{ success: boolean }>} El resultado de la operación de envío.
   */
  async sendPasswordResetEmail(
    email: string,
    resetLink: string
  ): Promise<{ success: boolean }> {
    // La lógica de implementación real con un proveedor como Resend iría aquí.
    // Ejemplo: await resend.emails.send({ ... });
    logger.info(
      {
        service: "EmailService",
        type: "password_reset",
        recipient: email,
        // No registrar el resetLink en producción por seguridad.
      },
      `[SIMULATED] Email de restablecimiento de contraseña enviado.`
    );
    // En la simulación, siempre asumimos éxito.
    return { success: true };
  },
};
// src/lib/actions/_helpers/email-service.helper.ts