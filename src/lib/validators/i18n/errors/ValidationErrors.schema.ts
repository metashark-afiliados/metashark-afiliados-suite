// src/lib/validators/i18n/errors/ValidationErrors.schema.ts
/**
 * @file ValidationErrors.schema.ts
 * @description Manifiesto de Tipos y SSoT para el contrato de errores de validación.
 *              Sincronizado para integrar el dominio de errores de 'campaigns'.
 * @author Raz Podesta - MetaShark Tech
 * @version 23.0.0
 * Florianópolis/SC, Brazil
 */
import { z } from "zod";

import * as ErrorSchemas from "./index";

export const ValidationErrorsSchema = z.object({
  // Dominios de Entidad/Acción
  generic: ErrorSchemas.GenericErrorsSchema,
  auth: ErrorSchemas.AuthErrorsSchema,
  admin: ErrorSchemas.AdminErrorsSchema,
  campaigns: ErrorSchemas.CampaignsErrorsSchema, 
  invitations: ErrorSchemas.InvitationErrorsSchema,
  onboarding: ErrorSchemas.OnboardingErrorsSchema,
  password: ErrorSchemas.PasswordErrorsSchema,
  sites: ErrorSchemas.SiteErrorsSchema,
  workspaces: ErrorSchemas.WorkspaceErrorsSchema,

  // Dominios de Página/Formulario
  contact_form: ErrorSchemas.ContactFormErrorsSchema,
  docs_page: ErrorSchemas.DocsPageErrorsSchema,
  legal_notice_page: ErrorSchemas.LegalNoticePageErrorsSchema,
  privacy_policy_page: ErrorSchemas.PrivacyPolicyPageErrorsSchema,
  support_page: ErrorSchemas.SupportPageErrorsSchema,
  terms_of_service_page: ErrorSchemas.TermsOfServicePageErrorsSchema,
  unauthorized_page: ErrorSchemas.UnauthorizedPageErrorsSchema,
  wiki_page: ErrorSchemas.WikiPageErrorsSchema,
});
// src/lib/validators/i18n/errors/ValidationErrors.schema.ts
