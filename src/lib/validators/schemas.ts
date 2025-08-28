// src/lib/validators/schemas.ts
/**
 * @file validators/schemas.ts
 * @description Biblioteca de Schemas de Zod y Única Fuente de Verdad (SSoT) para
 *              la validación de datos en toda la aplicación. Ha sido refactorizado
 *              holísticamente para incluir el nuevo `DashboardLayoutPreferencesSchema`,
 *              un contrato de datos esencial para la personalización de la UI.
 * @author Raz Podestá - MetaShark Tech
 * @version 7.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

import { ICON_LIBRARIES_MANIFEST } from "@/config/icon-libraries.config";
import { keysToSnakeCase } from "@/lib/helpers/object-case-converter";
import { slugify } from "@/lib/utils/text";

// --- ESQUEMAS BASE ATÓMICOS ---
export const UuidSchema = z.string().uuid({ message: "invalid_uuid" });

export const NameSchema = z
  .string({ required_error: "name_required" })
  .trim()
  .min(3, { message: "name_too_short" })
  .max(40, { message: "name_too_long" });

export const SubdomainSchema = z
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

// --- ESQUEMA DE REGISTRO (ARQUITECTURA DE PÁGINA DEDICADA) ---
export const SignUpSchema = z
  .object({
    email: EmailSchema,
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "terms_must_be_accepted",
    }),
    newsletterSubscribed: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords_do_not_match",
    path: ["confirmPassword"],
  });

// --- ESQUEMAS DE ENTIDADES ---

/**
 * @public
 * @constant DashboardLayoutPreferencesSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              preferencias de UI del usuario, almacenadas en `profiles.dashboard_layout`.
 *              Este esquema es crucial para la personalización de la interfaz.
 */
export const DashboardLayoutPreferencesSchema = z.object({
  /**
   * Indica si la barra lateral (sidebar) está colapsada.
   * @default false
   */
  isSidebarCollapsed: z.boolean().default(false),
  /**
   * El ID de la librería de iconos activa seleccionada por el usuario.
   * @default "lucide"
   */
  activeIconLibraryId: z
    .enum(ICON_LIBRARIES_MANIFEST.map((lib) => lib.id) as [string, ...string[]])
    .default("lucide"),
});

export const CreateCreationSchema = z.object({
  name: NameSchema,
  type: z.string().min(1), // ej. "landing-page", "doc"
});

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

export const CreateWorkspaceSchema = z.object({
  workspaceName: NameSchema,
});

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
