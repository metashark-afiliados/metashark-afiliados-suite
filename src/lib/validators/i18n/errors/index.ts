// src/lib/validators/i18n/errors/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para los schemas de errores atómicos.
 *              Ensambla los schemas de errores por dominio, facilitando su importación
 *              y manteniendo una arquitectura limpia. **Actualizado para incluir
 *              `SiteErrors.schema.ts`**.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 */

export * from "./GenericErrors.schema";
export * from "./AuthErrors.schema";
export * from "./AdminErrors.schema";
export * from "./InvitationErrors.schema";
export * from "./OnboardingErrors.schema";
export * from "./PasswordErrors.schema";
export * from "./DocsPageErrors.schema";
export * from "./LegalNoticePageErrors.schema";
export * from "./PrivacyPolicyPageErrors.schema";
export * from "./SupportPageErrors.schema";
export * from "./TermsOfServicePageErrors.schema";
export * from "./UnauthorizedPageErrors.schema";
export * from "./WikiPageErrors.schema";
export * from "./SiteErrors.schema"; // <-- NUEVA EXPORTACIÓN

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Módulo**: ((Implementada)) Se ha añadido la exportación de `SiteErrors.schema.ts` al barrel file, asegurando que el nuevo esquema atómico esté disponible para el ensamblador principal `ValidationErrors.schema.ts`.
 * 2. **Principio DRY y Mantenibilidad**: ((Implementada)) Al mantener este archivo como un simple ensamblador, se simplifica la gestión de importaciones y se mantiene la atomicidad de la estructura de errores.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Este archivo es un candidato ideal para ser generado por un script que lea el contenido del directorio `errors/`, eliminando la necesidad de actualizaciones manuales.
 *
 * =====================================================================
 */
