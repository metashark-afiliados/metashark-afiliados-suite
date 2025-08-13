// src/lib/validators/i18n/SitesPage.schema.ts
/**
 * @file SitesPage.schema.ts
 * @description Define el contrato de datos para el namespace 'SitesPage'.
 *              Ha sido nivelado para incluir todas las claves de texto de la
 *              UI y las claves para los mensajes de error de validación de Zod.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { z } from "zod";

export const SitesPageSchema = z.object({
  // Textos Generales
  entityName: z
    .string()
    .describe("Nombre singular de la entidad, ej. 'Sitio'."),

  // Textos del Encabezado (SitesHeader)
  header_title: z
    .string()
    .describe("Título principal de la página, ej. 'Mis Sitios'."),
  header_description: z
    .string()
    .describe("Subtítulo o descripción de la página."),
  search_placeholder: z
    .string()
    .describe("Texto para el placeholder del campo de búsqueda."),
  clear_search_aria: z
    .string()
    .describe("Aria-label para el botón de limpiar búsqueda."),
  createSite_button: z
    .string()
    .describe("Texto para el botón de acción principal para crear un sitio."),
  createSiteDialog_title: z
    .string()
    .describe("Título para el diálogo modal de creación de sitio."),

  // Textos del Formulario de Creación (CreateSiteForm)
  form_name_label: z
    .string()
    .describe("Etiqueta para el campo 'nombre del sitio'."),
  form_name_placeholder: z
    .string()
    .describe("Placeholder para el campo 'nombre del sitio'."),
  form_subdomain_label: z
    .string()
    .describe("Etiqueta para el campo 'subdominio'."),
  subdomain_in_use_error: z
    .string()
    .describe("Mensaje de error cuando un subdominio ya está en uso."),
  form_description_label: z
    .string()
    .describe("Etiqueta para el campo 'descripción'."),
  form_description_placeholder: z
    .string()
    .describe("Placeholder para el campo 'descripción'."),
  form_creating_button: z
    .string()
    .describe("Texto del botón de envío mientras se está creando."),
  form_create_button: z
    .string()
    .describe("Texto del botón de envío en estado normal."),

  // Textos de la Cuadrícula de Sitios (SitesGrid)
  emptyState_title: z
    .string()
    .describe("Título a mostrar cuando no hay sitios."),
  emptyState_description: z
    .string()
    .describe("Descripción a mostrar cuando no hay sitios."),

  // Textos de la Tarjeta de Sitio (SiteCard)
  campaignCount: z
    .string()
    .describe(
      "Texto para mostrar el número de campañas (ej. '{count} Campañas')."
    ),
  manageCampaigns_button: z
    .string()
    .describe("Texto del botón para gestionar campañas."),
  delete_site_aria_label: z
    .string()
    .describe("Aria-label para el botón de eliminar."),
  open_site_aria_label: z
    .string()
    .describe("Aria-label para el botón de abrir sitio."),
  popover_title: z.string().describe("Título del popover de previsualización."),
  popover_description: z
    .string()
    .describe("Descripción del popover de previsualización."),

  // Textos del Diálogo de Eliminación
  deleteDialog_title: z
    .string()
    .describe("Título del diálogo de confirmación de eliminación."),
  deleteDialog_description: z
    .string()
    .describe("Descripción del diálogo de confirmación (soporta HTML)."),
  deleteDialog_confirmButton: z
    .string()
    .describe("Texto para el botón de confirmación de eliminación."),

  // Textos del Estado de Error
  errorState: z.object({
    title: z.string(),
    description: z.string(),
  }),

  // Textos de Paginación
  pagination: z.object({
    previous: z.string(),
    next: z.string(),
    page: z.string(),
  }),

  // Claves de Error de Validación (Zod)
  error_name_required: z
    .string()
    .describe("Error cuando el nombre del sitio es omitido."),
  error_name_too_short: z
    .string()
    .describe("Error cuando el nombre del sitio es demasiado corto."),
  error_subdomain_too_short: z
    .string()
    .describe("Error cuando el subdominio es demasiado corto."),
  error_subdomain_invalid_chars: z
    .string()
    .describe("Error cuando el subdominio contiene caracteres inválidos."),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Contrato Completo**: ((Implementada)) El schema ahora incluye todas las claves de texto de UI y de error de validación, actuando como la SSoT para este namespace.
 * 2. **Documentación Embebida**: ((Implementada)) Se ha añadido `.describe()` a cada clave para documentar su propósito, mejorando la experiencia del desarrollador y del traductor.
 * =====================================================================
 */
// src/lib/validators/i18n/SitesPage.schema.ts
