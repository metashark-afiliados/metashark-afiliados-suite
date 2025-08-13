// src/lib/validators/i18n/Newsletter.schema.ts
/**
 * @file src/lib/validators/i18n/Newsletter.schema.ts
 * @description Define el contrato de datos para el namespace 'Newsletter',
 *              utilizado para los mensajes de feedback (toast) de la Server Action
 *              de suscripción.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

/**
 * @public
 * @constant NewsletterSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              claves de traducción de los resultados de la acción de newsletter.
 */
export const NewsletterSchema = z.object({
  /** Mensaje de éxito cuando el usuario ya está suscrito. */
  success_duplicate: z.string(),
  /** Mensaje de éxito para una nueva suscripción. */
  success_new: z.string(),
  /** Error genérico si la suscripción falla en el servidor. */
  error_server: z.string(),
  /** Error si el email proporcionado no es válido según Zod. */
  error_invalid_email: z.string(),
  /** Error para cualquier otra falla inesperada. */
  error_unexpected: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Feedback de Acción**: ((Implementada)) Este schema desacopla los mensajes de error de la lógica de la Server Action, permitiendo una internacionalización completa del feedback al usuario.
 * 2. **Atomicidad (IMAS)**: ((Implementada)) Schema aislado para su namespace, cumpliendo con la arquitectura.
 *
 * @subsection Melhorias Futuras
 * 1. **Parámetros en Mensajes**: ((Vigente)) Se podría modificar el contrato para soportar mensajes con parámetros, por ejemplo, `success_new: "¡Gracias por suscribirte, {email}!"`.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/Newsletter.schema.ts
