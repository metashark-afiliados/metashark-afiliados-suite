// src/lib/validators/i18n/errors/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para todos los schemas de errores atómicos.
 *              Sincronizado para incluir el nuevo dominio 'newsletter', resolviendo
 *              un error de compilación `TS2551`.
 * @author L.I.A. Legacy
 * @version 5.0.0
 */
export * from "./AdminErrors.schema";
export * from "./AuthErrors.schema";
export * from "./CampaignsErrors.schema";
export * from "./ContactFormErrors.schema";
export * from "./DocsPageErrors.schema";
export * from "./GenericErrors.schema";
export * from "./InvitationErrors.schema";
export * from "./LegalNoticePageErrors.schema";
export * from "./NewsletterErrors.schema"; // <-- EXPORTACIÓN CORREGIDA
export * from "./OnboardingErrors.schema";
export * from "./PasswordErrors.schema";
export * from "./PrivacyPolicyPageErrors.schema";
export * from "./SiteErrors.schema";
export * from "./SupportPageErrors.schema";
export * from "./TermsOfServicePageErrors.schema";
export * from "./UnauthorizedPageErrors.schema";
export * from "./WikiPageErrors.schema";
export * from "./WorkspaceErrors.schema";
// src/lib/validators/i18n/errors/index.ts
