// src/lib/validators/i18n/errors/PasswordErrors.schema.ts
/**
 * @file PasswordErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de acciones de contraseña (restablecimiento,
 *              actualización) sin un prefijo de dominio.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
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
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato encapsula los errores de contraseña, mejorando la modularidad.
 * 2. **Consistencia con Prefijos**: ((Implementada)) Las claves se definen sin prefijo, lo que permite que el ensamblador `ValidationErrors.schema.ts` aplique el prefijo `password_` de forma consistente.
 *
 * @subsection Melhorias Futuras
 * 1. **Errores Específicos de Validación de Fortaleza**: ((Vigente)) Si se implementa una validación más granular de la fortaleza de la contraseña en el backend, se añadirán aquí los errores específicos.
 *
 * =====================================================================
 */
