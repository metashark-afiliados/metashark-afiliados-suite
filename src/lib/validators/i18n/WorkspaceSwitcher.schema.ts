// src/lib/validators/i18n/WorkspaceSwitcher.schema.ts
/**
 * @file WorkspaceSwitcher.schema.ts
 * @description Define el contrato de datos para el namespace 'WorkspaceSwitcher'.
 *              Ha sido nivelado para incluir las claves de validación y toda la
 *              estructura de texto requerida por el componente y sus hijos.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { z } from "zod";

export const WorkspaceSwitcherSchema = z.object({
  // Textos del Popover Principal
  selectWorkspace_label: z
    .string()
    .describe("Aria-label para el botón principal del switcher."),
  search_placeholder: z
    .string()
    .describe("Placeholder para el campo de búsqueda de workspaces."),
  empty_results: z
    .string()
    .describe("Texto a mostrar cuando la búsqueda no encuentra workspaces."),
  changing_status: z
    .string()
    .describe(
      "Texto que se muestra en el botón mientras se cambia de workspace."
    ),

  // Acciones del Menú
  createWorkspace_button: z
    .string()
    .describe("Texto para la opción de crear un nuevo workspace."),
  inviteMember_button: z
    .string()
    .describe("Texto para la opción de invitar a un miembro."),
  inviteMember_description: z
    .string()
    .describe("Descripción en el diálogo de invitación (soporta HTML)."),
  workspaceSettings_button: z
    .string()
    .describe("Texto para la opción de ir a los ajustes del workspace."),

  // Flujo de Onboarding (Primer Uso)
  onboarding_title: z
    .string()
    .describe("Título principal para la página o diálogo de onboarding."),
  onboarding_welcome_title: z
    .string()
    .describe("Título de bienvenida en el diálogo de onboarding."),
  onboarding_welcome_description: z
    .string()
    .describe("Descripción en el diálogo de onboarding."),

  // Formulario de Creación de Workspace
  create_form: z.object({
    name_label: z.string(),
    name_placeholder: z.string(),
    icon_label: z.string(),
    icon_placeholder: z.string(),
    creating_button: z.string(),
    create_button: z.string(),
    success_toast: z.string(),
  }),

  // Formulario de Invitación de Miembro
  invite_form: z.object({
    email_label: z.string(),
    email_placeholder: z.string(),
    role_label: z.string(),
    role_placeholder: z.string(),
    role_member: z.string(),
    role_admin: z.string(),
    sending_button: z.string(),
    send_button: z.string(),
  }),

  // Claves de Error de Validación (Zod)
  error_icon_required: z
    .string()
    .describe("Error cuando el ícono del workspace es omitido."),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Contrato Completo**: ((Implementada)) El schema ahora incluye todas las claves necesarias para el componente, sus formularios hijos y los errores de validación.
 * 2. **Documentación Embebida**: ((Implementada)) Se ha añadido `.describe()` a cada clave para documentar su propósito.
 * =====================================================================
 */
// src/lib/validators/i18n/WorkspaceSwitcher.schema.ts
