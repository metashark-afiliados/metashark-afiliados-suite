// src/lib/validators/i18n/errors/PrivacyPolicyPageErrors.schema.ts
/**
 * @file PrivacyPolicyPageErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de validación específicos de la página de
 *              Política de Privacidad sin un prefijo de dominio.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
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
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato encapsula los errores específicos de la página de política de privacidad, mejorando la modularidad.
 * 2. **Consistencia con Prefijos**: ((Implementada)) Las claves se definen sin prefijo, lo que permite que el ensamblador `ValidationErrors.schema.ts` aplique el prefijo `privacy_policy_page_` de forma consistente.
 *
 * @subsection Melhorias Futuras
 * 1. **Errores de Consentimiento**: ((Vigente)) Si se introduce un sistema de gestión de consentimiento de datos, se añadirán aquí los errores relacionados (ej. `consent_required`).
 *
 * =====================================================================
 */
