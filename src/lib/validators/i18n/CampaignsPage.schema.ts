/**
 * @file src/lib/validators/i18n/CampaignsPage.schema.ts
 * @description Define el contrato de datos para el namespace 'CampaignsPage'.
 *              Nivelado a un estándar de élite con una estructura anidada que
 *              refleja directamente los contratos de props de los componentes
 *              de presentación y las claves de feedback de las Server Actions.
 * @author Raz Podestá
 * @version 4.0.0
 */
import { z } from "zod";

export const CampaignsPageSchema = z.object({
  entityName: z
    .string()
    .describe("Nombre singular de la entidad, ej. 'Campaña'."),
  pageTitle: z.string().describe("Título de la página (soporta HTML)."),
  pageDescription: z.string().describe("Subtítulo de la página."),
  backToSitesButton: z.string(),

  // Textos para el Hub de Creación y el Header
  createCampaignButton: z.string(),
  createDialog: z.object({
    title: z.string(),
    description: z.string(),
    tabs: z.object({
      from_scratch: z.string(),
      from_template: z.string(),
      from_image_ai: z.string(),
    }),
    template_gallery_placeholder: z.string(),
    ai_importer_placeholder: z.string(),
  }),

  // Textos para el Formulario de Creación
  form: z.object({
    name_label: z.string(),
    name_placeholder: z.string(),
    creating_button: z.string(),
    create_button: z.string(),
  }),

  // Filtros y Búsqueda
  filters: z.object({
    status_label: z.string(),
    status_placeholder: z.string(),
    status_all: z.string(),
    sort_label: z.string(),
    sort_placeholder: z.string(),
    sort_updated_desc: z.string(),
    sort_name_asc: z.string(),
  }),
  search: z.object({
    placeholder: z.string(),
    clear_aria: z.string(),
  }),

  // Textos para la Tabla de Datos
  table: z.object({
    header_name: z.string(),
    header_status: z.string(),
    header_lastUpdated: z.string(),
    header_actions: z.string(),
    action_edit: z.string(),
    action_analytics: z.string(),
    action_duplicate: z.string(),
    action_archive: z.string(),
    action_delete: z.string(),
    empty_state: z.string(),
  }),
  status: z.object({
    draft: z.string(),
    published: z.string(),
    archived: z.string(),
  }),

  // Diálogo de Eliminación
  deleteDialog: z.object({
    title: z.string(),
    description: z.string().describe("Soporta HTML."),
    confirmButton: z.string(),
    confirmation_label: z.string().describe("Soporta HTML."),
  }),

  // Paginación
  pagination: z.object({
    previous: z.string(),
    next: z.string(),
    page: z.string(),
  }),

  // Toasts de Feedback
  toasts: z.object({
    delete_success: z.string(),
    duplicate_success: z.string(),
    archive_success: z.string(),
    duplicating: z.string(),
    archiving: z.string(),
  }),

  // Claves de Error de Server Actions
  errors: z.object({
    unauthenticated: z.string(),
    site_not_found: z.string(),
    permission_denied: z.string(),
    creation_failed: z.string(),
    deletion_failed: z.string(),
    duplication_failed: z.string(),
    archive_failed: z.string(),
    campaign_not_found: z.string(),
    invalid_data: z.string(),
    invalid_id: z.string(),
    unexpected: z.string(),
  }),
});
