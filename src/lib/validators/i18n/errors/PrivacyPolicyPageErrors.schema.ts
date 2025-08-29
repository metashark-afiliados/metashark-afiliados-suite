// src/lib/validators/i18n/errors/PrivacyPolicyPageErrors.schema.ts
/**
 * @file PrivacyPolicyPageErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de validación específicos de la página de
 *              Política de Privacidad sin un prefijo de dominio.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 */
import { z } from "zod";

export const PrivacyPolicyPageErrorsSchema = z.object({
  title_required: z.string(),
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
 * 1. **Errores de Consentimiento**: ((Vigente)) Si se introduce un sistema de gestión de consentimiento de datos más complejo, se añadirán aquí los errores relacionados (ej. `consent_version_mismatch`).
 *
 * =====================================================================
 */
// src/lib/validators/i18n/errors/PrivacyPolicyPageErrors.schema.ts
