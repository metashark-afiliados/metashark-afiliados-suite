// src/lib/validators/i18n/DashboardSidebar.schema.ts
/**
 * @file DashboardSidebar.schema.ts
 * @description Define el contrato de datos para el namespace 'DashboardSidebar'.
 *              Actualizado para incluir las claves de branding de la aplicación.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { z } from "zod";

export const DashboardSidebarSchema = z.object({
  // --- Claves de Branding (Nuevas) ---
  app_title: z.string(),
  app_description: z.string(),

  // --- Claves Existentes ---
  brand_name: z.string(),
  logo_alt_text: z.string(),
  logo_aria_label: z.string(),
  dashboard: z.string(),
  mySites: z.string(),
  liaChat: z.string(),
  settings: z.string(),
  devConsole: z.string(),
  userMenu_accountSettings: z.string(),
  userMenu_support: z.string(),
  userMenu_signOut: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato de Tipos**: ((Implementada)) El schema ahora incluye `app_title` y `app_description`, asegurando que el contrato de datos de Zod esté perfectamente alineado con el archivo de mensajes JSON. Esto garantiza la integridad del sistema de i18n.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Longitud**: ((Vigente)) Se podrían añadir validaciones de longitud (ej. `.max(60)` para `app_title`) para cumplir con las mejores prácticas de SEO para los metadatos.
 *
 * =====================================================================
 */
