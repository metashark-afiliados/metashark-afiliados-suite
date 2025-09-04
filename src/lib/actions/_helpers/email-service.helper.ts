// src/lib/actions/_helpers/email-service.helper.ts
/**
 * @file src/lib/actions/_helpers/email-service.helper.ts
 * @description Aparato de servicio atómico que actúa como una Capa Anti-Corrupción
 *              y SSoT para el envío de correos electrónicos transaccionales.
 *              Desacopla la aplicación de la implementación de un proveedor
 *              específico (ej. Resend, SendGrid) y proporciona una simulación
 *              de alta fidelidad para el desarrollo local.
 * @author L.I.A. Legacy
 * @version 2.0.0
 * @see .docs-espejo/lib/actions/_helpers/email-service.helper.ts.md
 */
import "server-only";

import { logger } from "@/lib/logger";

/**
 * @public
 * @constant EmailService
 * @description Objeto que encapsula los métodos para el envío de diferentes
 *              tipos de correos transaccionales.
 */
export const EmailService = {
  /**
   * @public
   * @async
   * @function sendPasswordResetEmail
   * @description Envía un correo electrónico de restablecimiento de contraseña.
   *              En un entorno de producción, interactuaría con un proveedor de servicios de email.
   * @param {string} email - La dirección de correo electrónico del destinatario.
   * @param {string} resetLink - El enlace único y seguro para el restablecimiento.
   * @returns {Promise<{ success: boolean }>} El resultado de la operación de envío.
   */
  async sendPasswordResetEmail(
    email: string,
    resetLink: string
  ): Promise<{ success: boolean }> {
    // La lógica de implementación real con un proveedor como Resend iría aquí.
    // Ejemplo: await resend.emails.send({ to: email, ... });

    // Adherencia a la Directiva 1.1: Firma Canónica del Logger.
    // El email se pasa en el contexto para ser redactado automáticamente.
    logger.info(
      {
        service: "EmailService",
        type: "password_reset",
        email, // Esta clave será redactada por la configuración de Pino.
      },
      "[SIMULATED] Email de restablecimiento de contraseña enviado."
    );

    // En la simulación, siempre asumimos éxito.
    return { success: true };
  },
};
// src/lib/actions/_helpers/email-service.helper.ts
