// src/lib/validators/i18n/errors/UnauthorizedPageErrors.schema.ts
/**
 * @file UnauthorizedPageErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de validación específicos de la página de
 *              Acceso No Autorizado sin un prefijo de dominio.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 */
import { z } from "zod";

export const UnauthorizedPageErrorsSchema = z.object({
  title_required: z.string(),
  description_required: z.string(),
  button_required: z.string(),
  section_title_required: z.string(),
  paragraph_required: z.string(),
  body_content_required: z.string(),
  content_sections_required: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Errores de Redirección Contextual**: Si la página implementa lógica para redireccionar al usuario a una página de origen específica después de un login, se añadirán aquí las claves de error relacionadas (ej. `invalid_redirect_target`).
 * 2. **Error de Carga de Contexto**: Añadir una clave `context_load_failed` para manejar casos en los que la página no pueda determinar por qué el acceso fue denegado.
 * =====================================================================
 */
// src/lib/validators/i18n/errors/UnauthorizedPageErrors.schema.ts
