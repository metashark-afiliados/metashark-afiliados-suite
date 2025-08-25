// src/lib/validators/i18n/DashboardSidebar.schema.ts
/**
 * @file DashboardSidebar.schema.ts
 * @description Define el contrato de datos para el namespace 'DashboardSidebar'.
 *              Sincronizado con la arquitectura del "Workspace Creativo" v17.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const DashboardSidebarSchema = z.object({
  // --- Branding & Layout ---
  app_title: z.string(),
  app_description: z.string(),
  brand_name: z.string(),
  logo_alt_text: z.string(),
  logo_aria_label: z.string(),
  create_button: z.string(),
  search_placeholder: z.string(),
  search_command: z.string(),
  toggle_sidebar_aria_label: z.string(),

  // --- Navegación Principal ---
  nav_home: z.string(),
  nav_projects: z.string(),
  nav_templates: z.string(),
  nav_brand: z.string(),

  // --- Navegación Secundaria (Legado) ---
  dashboard: z.string(),
  mySites: z.string(),
  liaChat: z.string(),
  settings: z.string(),
  iconLibrary: z.string(),
  devConsole: z.string(),

  // --- Menú/Widget de Usuario ---
  userMenu_accountSettings: z.string(),
  userMenu_support: z.string(),
  userMenu_signOut: z.string(),
  userMenu_avatar_alt: z.string(),
  userMenu_open_aria_label: z.string(),
  userMenu_close_widget_aria_label: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato Completo**: ((Implementada)) Se han añadido las claves `userMenu_*` y `toggle_sidebar_aria_label`, resolviendo la causa raíz de los errores de i18n en el build de Vercel.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/DashboardSidebar.schema.ts
