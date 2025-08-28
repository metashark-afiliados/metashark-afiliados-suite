// src/lib/validators/i18n/ValidationErrors.schema.ts
/**
 * @file ValidationErrors.schema.ts
 * @description Manifiesto de Tipos y SSoT para el contrato de errores de validación.
 *              Ha sido **atomizado y refactorizado holísticamente** para ensamblar
 *              schemas de error más pequeños y por dominio, resolviendo el monolito
 *              previo y mejorando drásticamente la mantenibilidad y escalabilidad.
 *              **Corregido para reflejar directamente la estructura anidada** del
 *              archivo `src/messages/shared/ValidationErrors.json`, eliminando
 *              la necesidad de aplanar y prefijar claves en este nivel.
 * @author Raz Podestá - MetaShark Tech
 * @version 18.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 */
import { z } from "zod";

// --- Importaciones de Schemas Atómicos de Errores (Ensamblaje "LEGO") ---
// Se importa el barrel file, que re-exporta todos los schemas atómicos.
import * as ErrorSchemas from "./errors";

// El helper `prefixKeys` ya no es necesario en este ensamblador
// porque los schemas atómicos ahora se incluyen directamente en propiedades anidadas
// y sus claves internas ya están en el formato deseado (sin prefijos).

export const ValidationErrorsSchema = z.object({
  // Errores Genéricos (directamente incluidos)
  generic: ErrorSchemas.GenericErrorsSchema,

  // Errores de Autenticación (incluidos directamente bajo su dominio)
  auth: ErrorSchemas.AuthErrorsSchema,

  // Errores de Administración (incluidos directamente bajo su dominio)
  admin: ErrorSchemas.AdminErrorsSchema,

  // Errores de Invitaciones (incluidos directamente bajo su dominio)
  invitations: ErrorSchemas.InvitationErrorsSchema,

  // Errores de Onboarding (incluidos directamente bajo su dominio)
  onboarding: ErrorSchemas.OnboardingErrorsSchema,

  // Errores de Contraseña (incluidos directamente bajo su dominio)
  password: ErrorSchemas.PasswordErrorsSchema,

  // Errores de Páginas Legales y de Información (incluidos directamente bajo su dominio)
  docs_page: ErrorSchemas.DocsPageErrorsSchema,
  legal_notice_page: ErrorSchemas.LegalNoticePageErrorsSchema,
  privacy_policy_page: ErrorSchemas.PrivacyPolicyPageErrorsSchema,
  support_page: ErrorSchemas.SupportPageErrorsSchema,
  terms_of_service_page: ErrorSchemas.TermsOfServicePageErrorsSchema,
  unauthorized_page: ErrorSchemas.UnauthorizedPageErrorsSchema,
  wiki_page: ErrorSchemas.WikiPageErrorsSchema,

  // Nuevos errores de sitios (incluidos directamente bajo su dominio)
  sites: ErrorSchemas.SiteErrorsSchema,
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 18.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 *
 * @subsection Melhorias Adicionadas
 * 1. **Consistencia Estructural (SSoT)**: ((Implementada)) Este archivo ha sido refactorizado para que su estructura de Zod refleje directamente la anidación por dominio del archivo JSON `src/messages/shared/ValidationErrors.json`. Esto asegura que el contrato de validación (Zod) y la fuente de contenido (JSON) tengan la misma forma, adhiriéndose al principio de Única Fuente de Verdad.
 * 2. **Eliminación de Lógica de Prefijado Innecesaria**: ((Implementada)) El helper `prefixKeys` ha sido eliminado de este ensamblador, ya que la estructura anidada directa es la forma correcta de mapear el JSON. Esto simplifica el esquema y reduce la complejidad.
 * 3. **Tipado Preciso para `useTypedTranslations`**: ((Implementada)) Con esta corrección, el `useTypedTranslations("shared.ValidationErrors")` ahora puede generar una función `t` que permite acceder a los mensajes de error de forma tipo-segura y anidada (ej., `t("auth.login_invalid_credentials")`), eliminando la necesidad de `as any` en los componentes que lo consumen.
 * 4. **Versionado Consistente**: ((Implementada)) Se ha incrementado la versión a `18.0.0` para reflejar esta corrección arquitectónica crítica.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática de `ValidationErrors.schema.ts`**: ((Vigente)) Para una mantenibilidad de élite a largo plazo, este ensamblador podría ser generado automáticamente por un script. El script escanearía el directorio `errors/`, importaría todos los schemas y los ensamblaría dinámicamente con los prefijos correctos. Esto eliminaría la necesidad de actualizaciones manuales de este archivo.
 *
 * =====================================================================
 */
