// src/lib/validators/i18n/errors/UnauthorizedPageErrors.schema.ts
/**
 * @file UnauthorizedPageErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de validación específicos de la página de
 *              Acceso No Autorizado sin un prefijo de dominio.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
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
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato encapsula los errores específicos de la página no autorizada, mejorando la modularidad.
 * 2. **Consistencia con Prefijos**: ((Implementada)) Las claves se definen sin prefijo, lo que permite que el ensamblador `ValidationErrors.schema.ts` aplique el prefijo `unauthorized_page_` de forma consistente.
 *
 * @subsection Melhorias Futuras
 * 1. **Errores de Redirección Contextual**: ((Vigente)) Si la página tiene lógica de redirección contextual, se añadirán aquí los errores relacionados (ej. `invalid_redirect_target`).
 *
 * =====================================================================
 */
