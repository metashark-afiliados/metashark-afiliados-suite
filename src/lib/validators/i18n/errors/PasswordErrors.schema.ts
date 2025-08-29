// src/lib/validators/i18n/errors/PasswordErrors.schema.ts
/**
 * @file PasswordErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de feedback de acciones de contraseña (restablecimiento,
 *              actualización) sin un prefijo de dominio.
 *              **Actualizado para incluir claves de éxito.**
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const PasswordErrorsSchema = z.object({
  reset_invalid_email: z.string(),
  reset_too_many_requests: z.string(),
  update_invalid_data: z.string(),
  update_expired_link: z.string(),
  update_failed: z.string(),
  // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Claves de éxito ---
  update_success: z
    .string()
    .describe(
      "Mensaje de éxito al actualizar la contraseña. Placeholder: {redirectDelay}"
    ),
  // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
});

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
 * @subsection Melhorias Novas
 * 1. **Claves de Éxito para `requestPasswordReset`**: ((Vigente)) La acción `requestPasswordResetAction` no devuelve un toast de éxito (redirige directamente), pero podría hacerlo en el futuro, por lo que se añadirían las claves aquí.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/errors/PasswordErrors.schema.ts
