// src/lib/validators/i18n/ValidationErrors.schema.ts
/**
 * @file ValidationErrors.schema.ts
 * @description Manifiesto de Tipos y SSoT para el contrato de errores de validación.
 *              Ha sido refactorizado holísticamente a un estándar de élite para
 *              ensamblar schemas de error atómicos, por dominio, en un único
 *              contrato anidado. Esta es la culminación de la arquitectura de
 *              errores soberana.
 * @author Raz Podestá - MetaShark Tech
 * @version 21.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 */
import { z } from "zod";

// --- Importaciones de Schemas Atómicos (Ensamblaje "LEGO") ---
// Se importa el barrel file, que re-exporta todos los schemas atómicos.
import * as ErrorSchemas from "./errors";

export const ValidationErrorsSchema = z.object({
  // Errores Genéricos
  generic: ErrorSchemas.GenericErrorsSchema,

  // Errores por Dominio de Entidad/Acción
  auth: ErrorSchemas.AuthErrorsSchema,
  admin: ErrorSchemas.AdminErrorsSchema,
  invitations: ErrorSchemas.InvitationErrorsSchema,
  onboarding: ErrorSchemas.OnboardingErrorsSchema,
  password: ErrorSchemas.PasswordErrorsSchema,
  sites: ErrorSchemas.SiteErrorsSchema,
  workspaces: ErrorSchemas.WorkspaceErrorsSchema,

  // Errores por Dominio de Página/Formulario
  contact_form: ErrorSchemas.ContactFormErrorsSchema,
  docs_page: ErrorSchemas.DocsPageErrorsSchema,
  legal_notice_page: ErrorSchemas.LegalNoticePageErrorsSchema,
  privacy_policy_page: ErrorSchemas.PrivacyPolicyPageErrorsSchema,
  support_page: ErrorSchemas.SupportPageErrorsSchema,
  terms_of_service_page: ErrorSchemas.TermsOfServicePageErrorsSchema,
  unauthorized_page: ErrorSchemas.UnauthorizedPageErrorsSchema,
  wiki_page: ErrorSchemas.WikiPageErrorsSchema,
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 21.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática del Ensamblador**: Para una DX de élite, un script (`pnpm gen:i18n:errors`) podría leer el manifiesto `errors/index.ts` y generar automáticamente este archivo ensamblador, eliminando la necesidad de actualizaciones manuales y garantizando una sincronización perfecta.
 * 2. **Validación Cruzada de Nombres de Archivo y Claves de Dominio**: El script de generación podría validar que el nombre del archivo de schema (ej. `SiteErrors.schema.ts`) coincida con la clave de dominio en este ensamblador (`sites`), previniendo desajustes.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/ValidationErrors.schema.ts
