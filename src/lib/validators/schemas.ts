// src/lib/validators/schemas.ts
/**
 * @file validators/schemas.ts
 * @description Biblioteca de Schemas de Zod y Única Fuente de Verdad para todas
 *              las reglas de validación de datos. Sincronizado para eliminar la
 *              validación del campo `icon` en `CreateWorkspaceSchema`.
 * @author Raz Podestá
 * @version 2.3.0
 */
import { z } from "zod";

import { keysToSnakeCase } from "@/lib/helpers/object-case-converter";
import { slugify } from "@/lib/utils/text";

// --- ESQUEMAS BASE ATÓMICOS (INTERNACIONALIZADOS) ---

/**
 * @public
 * @constant UuidSchema
 * @description Valida que una cadena sea un UUID válido. El mensaje de error es
 *              una clave de i18n para ser traducida en la UI.
 */
const UuidSchema = z
  .string()
  .uuid({ message: "ValidationErrors.invalid_uuid" });

/**
 * @public
 * @constant NameSchema
 * @description Valida un nombre genérico (para workspaces, sitios, campañas).
 *              Asegura que no esté vacío y cumpla con los límites de longitud.
 *              Los mensajes de error son claves de i18n.
 */
const NameSchema = z
  .string({ required_error: "ValidationErrors.name_required" })
  .trim()
  .min(3, { message: "ValidationErrors.name_too_short" })
  .max(40, { message: "ValidationErrors.name_too_long" });

/**
 * @public
 * @constant SubdomainSchema
 * @description Valida y sanitiza un subdominio. Asegura longitud mínima,
 *              caracteres válidos (slug-like) y transforma a minúsculas.
 */
const SubdomainSchema = z
  .string()
  .trim()
  .min(3, { message: "ValidationErrors.subdomain_too_short" })
  .regex(/^[a-z0-9-]+$/, {
    message: "ValidationErrors.subdomain_invalid_chars",
  })
  .transform((subdomain) => subdomain.toLowerCase());

/**
 * @public
 * @constant EmailSchema
 * @description Valida una dirección de correo electrónico.
 */
export const EmailSchema = z
  .string()
  .trim()
  .email({ message: "ValidationErrors.invalid_email" });

/**
 * @public
 * @constant PasswordSchema
 * @description Valida una contraseña, asegurando una longitud mínima.
 */
export const PasswordSchema = z
  .string()
  .min(8, { message: "ValidationErrors.password_too_short" });

// --- ESQUEMAS DE ENTIDADES ---

export const CreateSiteClientSchema = z.object({
  name: NameSchema.optional(),
  subdomain: SubdomainSchema,
  description: z.string().optional(),
  workspaceId: UuidSchema,
});

export const CreateSiteServerSchema = CreateSiteClientSchema.transform(
  (data) => ({
    ...data,
    name: data.name || data.subdomain,
    description: data.description || null,
  })
).transform(keysToSnakeCase);

export const UpdateSiteSchema = z
  .object({
    siteId: UuidSchema,
    name: NameSchema.optional(),
    subdomain: SubdomainSchema.optional(),
    description: z.string().optional(),
  })
  .transform(keysToSnakeCase);

export const DeleteSiteSchema = z.object({ siteId: UuidSchema });

export const CreateWorkspaceSchema = z
  .object({
    workspaceName: NameSchema,
  })
  .transform(keysToSnakeCase);

export const UpdateWorkspaceNameSchema = z.object({
  name: NameSchema,
});

export const DeleteWorkspaceSchema = z.object({ workspaceId: UuidSchema });

export const InvitationClientSchema = z.object({
  email: EmailSchema,
  role: z.enum(["admin", "member", "owner"]),
  workspaceId: UuidSchema,
});

export const InvitationServerSchema = InvitationClientSchema.transform(
  (data) => ({
    invitee_email: data.email,
    role: data.role,
    workspace_id: data.workspaceId,
  })
);

export const CreateCampaignSchema = z
  .object({
    name: NameSchema,
    slug: z
      .string()
      .trim()
      .min(3, { message: "ValidationErrors.slug_too_short" })
      .regex(/^[a-z0-9-]+$/, {
        message: "ValidationErrors.slug_invalid_chars",
      })
      .optional(),
    siteId: UuidSchema,
  })
  .transform((data) => ({ ...data, slug: data.slug || slugify(data.name) }))
  .transform(keysToSnakeCase);

export const DeleteCampaignSchema = z.object({ campaignId: UuidSchema });

export const ClientVisitSchema = z.object({
  sessionId: UuidSchema,
  fingerprint: z
    .string()
    .min(1, { message: "ValidationErrors.fingerprint_required" }),
  screenWidth: z.number().int().positive().optional(),
  screenHeight: z.number().int().positive().optional(),
  userAgentClientHint: z
    .array(z.object({ brand: z.string(), version: z.string() }))
    .nullable()
    .optional(),
});

export const VisitorLogSchema = z.object({
  session_id: UuidSchema,
  fingerprint: z
    .string()
    .min(1, { message: "ValidationErrors.fingerprint_required" }),
  ip_address: z.string().ip({ message: "ValidationErrors.invalid_ip" }),
  geo_data: z.record(z.any()).nullable().optional(),
  user_agent: z.string().nullable().optional(),
  utm_params: z.record(z.any()).nullable().optional(),
  referrer: z.string().url().nullable().optional(),
  landing_page: z.string().nullable().optional(),
  browser_context: z.record(z.any()).nullable().optional(),
  is_bot: z.boolean().optional(),
  is_known_abuser: z.boolean().optional(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Simplificación de Contrato**: ((Implementada)) Se ha eliminado la validación de `icon` del `CreateWorkspaceSchema`, alineándolo con la nueva estructura de la base de datos y simplificando el contrato de datos.
 * 2. **Documentación TSDoc de Élite**: ((Implementada)) Se ha enriquecido la documentación TSDoc de los schemas base para clarificar su propósito y uso.
 *
 * @subsection Melhorias Futuras
 * 1. **Schema de Actualización de Perfil**: ((Vigente)) Crear un `UpdateProfileSchema` que valide `full_name` y `avatar_url` para la futura página de ajustes de perfil.
 * 2. **Normalización de Schemas**: ((Vigente)) Los schemas de eliminación (`DeleteWorkspaceSchema`, `DeleteSiteSchema`, `DeleteCampaignSchema`) son estructuralmente idénticos. Se podrían unificar en un `DeleteEntitySchema` genérico para un mayor cumplimiento del principio DRY.
 * 3. **Refinamiento de Mensajes de Error**: ((Vigente)) Analizar la posibilidad de añadir parámetros a los mensajes de error de Zod (ej. `name_too_short: "El nombre debe tener al menos {minLength} caracteres."`) para una mayor flexibilidad en la internacionalización.
 *
 * =====================================================================
 */
// src/lib/validators/schemas.ts
