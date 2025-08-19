// src/lib/validators/schemas.ts
/**
 * @file validators/schemas.ts
 * @description Biblioteca de Schemas de Zod y SSoT. Refactorizado a un
 *              estándar de élite eliminando los namespaces de los mensajes
 *              de error para una arquitectura de i18n desacoplada.
 * @author Raz Podestá
 * @version 2.5.0
 */
import { z } from "zod";

import { keysToSnakeCase } from "@/lib/helpers/object-case-converter";
import { slugify } from "@/lib/utils/text";

// --- ESQUEMAS BASE ATÓMICOS ---
const UuidSchema = z.string().uuid({ message: "invalid_uuid" });
const NameSchema = z
  .string({ required_error: "name_required" })
  .trim()
  .min(3, { message: "name_too_short" })
  .max(40, { message: "name_too_long" });
const SubdomainSchema = z
  .string()
  .trim()
  .min(3, { message: "subdomain_too_short" })
  .regex(/^[a-z0-9-]+$/, {
    message: "subdomain_invalid_chars",
  })
  .transform((subdomain) => subdomain.toLowerCase());
export const EmailSchema = z
  .string()
  .trim()
  .email({ message: "invalid_email" });
export const PasswordSchema = z
  .string()
  .min(8, { message: "password_too_short" });

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
      .min(3, { message: "slug_too_short" })
      .regex(/^[a-z0-9-]+$/, {
        message: "slug_invalid_chars",
      })
      .optional(),
    siteId: UuidSchema,
  })
  .transform((data) => ({ ...data, slug: data.slug || slugify(data.name) }))
  .transform(keysToSnakeCase);

export const DeleteCampaignSchema = z.object({ campaignId: UuidSchema });

// --- ESQUEMAS DE TELEMETRÍA ---
export const VisitorLogSchema = z.object({
  session_id: UuidSchema,
  fingerprint: z.string().min(1, { message: "fingerprint_required" }),
  ip_address: z.string().ip({ message: "invalid_ip" }),
  geo_data: z.record(z.any()).nullable().optional(),
  user_agent: z.string().nullable().optional(),
  utm_params: z.record(z.any()).nullable().optional(),
  referrer: z.string().url().nullable().optional(),
  landing_page: z.string().nullable().optional(),
  browser_context: z.record(z.any()).nullable().optional(),
  is_bot: z.boolean().optional(),
  is_known_abuser: z.boolean().optional(),
});

export const ClientEnrichmentSchema = z.object({
  sessionId: UuidSchema,
  fingerprint: z.string().min(1, { message: "fingerprint_required" }),
  browser_context: z.record(z.any()).nullable().optional(),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura I18n Desacoplada**: ((Implementada)) Se han eliminado los prefijos de namespace de los mensajes de error de Zod. Esto resuelve el error de `MISSING_MESSAGE` y establece un patrón arquitectónico correcto.
 *
 * =====================================================================
 */
// src/lib/validators/schemas.ts
