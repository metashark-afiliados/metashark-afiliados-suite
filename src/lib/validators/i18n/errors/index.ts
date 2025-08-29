// src/lib/validators/i18n/errors/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para todos los schemas de errores atómicos.
 *              Ensambla y exporta todos los contratos de error por dominio, proveyendo
 *              una fachada limpia y completa para ser consumida por el ensamblador final
 *              `ValidationErrors.schema.ts`. Esta es la SSoT para las exportaciones del
 *              sub-módulo de errores.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 */
export * from "./AdminErrors.schema";
export * from "./AuthErrors.schema";
export * from "./ContactFormErrors.schema";
export * from "./DocsPageErrors.schema";
export * from "./GenericErrors.schema";
export * from "./InvitationErrors.schema";
export * from "./LegalNoticePageErrors.schema";
export * from "./OnboardingErrors.schema";
export * from "./PasswordErrors.schema";
export * from "./PrivacyPolicyPageErrors.schema";
export * from "./SiteErrors.schema";
export * from "./SupportPageErrors.schema";
export * from "./TermsOfServicePageErrors.schema";
export * from "./UnauthorizedPageErrors.schema";
export * from "./WikiPageErrors.schema";
export * from "./WorkspaceErrors.schema";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: Este archivo es el candidato ideal para ser generado y mantenido por un script (`pnpm gen:manifests`) que lea la estructura del directorio `errors/` y construya las exportaciones, eliminando la necesidad de actualizaciones manuales y previniendo errores de omisión.
 * 2. **Verificación de Integridad en CI/CD**: Implementar un paso en el pipeline de CI/CD que ejecute el script de generación y falle si detecta una desincronización entre el archivo y el directorio, forzando la consistencia.
 * =====================================================================
 */
// src/lib/validators/i18n/errors/index.ts
