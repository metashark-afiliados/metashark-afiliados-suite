// src/lib/validators/i18n/DashboardSidebar.schema.ts
/**
 * @file DashboardSidebar.schema.ts
 * @description Define el contrato de datos para el namespace 'DashboardSidebar'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const DashboardSidebarSchema = z.object({
  dashboard: z.string(),
  mySites: z.string(),
  liaChat: z.string(),
  settings: z.string(),
  devConsole: z.string(),
  userMenu_accountSettings: z.string(),
  userMenu_support: z.string(),
  userMenu_signOut: z.string(),
  logo_aria_label: z.string(),
  logo_alt_text: z.string(),
  brand_name: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/DashboardSidebar.schema.ts
