// src/lib/actions/_helpers/email-service.helper.ts
/**
 * @file src/lib/actions/_helpers/email-service.helper.ts
 * @description Helper que abstrae y centraliza el servicio de envío de correos
 *              electrónicos transaccionales. Ha sido corregido para eliminar la
 *              directiva `"use server"` incorrecta, ya que es un módulo de
 *              utilidad del servidor, no un endpoint de API de cliente.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import "server-only";

import { logger } from "@/lib/logging";

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
   * @param {string} email - La dirección de correo electrónico del destinatario.
   * @param {string} resetLink - El enlace único y seguro para el restablecimiento.
   * @returns {Promise<{ success: boolean }>} El resultado de la operación de envío.
   */
  async sendPasswordResetEmail(
    email: string,
    resetLink: string
  ): Promise<{ success: boolean }> {
    logger.info(
      `[EmailService:Simulated] Enviando correo de restablecimiento de contraseña a ${email}.`
    );
    // La lógica de implementación real con un proveedor como Resend iría aquí.
    return { success: true };
  },
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Corrección de Arquitectura de Módulo**: ((Implementada)) Se ha eliminado la directiva `"use server"`. Esta corrección es la clave para resolver el error de compilación `A "use server" file can only export async functions, found object`. El helper ahora es un módulo `server-only` estándar, que es el patrón correcto para utilidades de backend.
 *
 * @subsection Melhorias Futuras
 * 1. **Integración Real con Proveedor de Email**: ((Vigente)) Reemplazar la simulación actual con una integración real con un proveedor de email transaccional (ej. Resend, Postmark), utilizando `react-email` para la creación de templates.
 *
 * =====================================================================
 */
// src/lib/actions/_helpers/email-service.helper.ts
