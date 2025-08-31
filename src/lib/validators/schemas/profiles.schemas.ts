// src/lib/validators/schemas/profiles.schemas.ts
/**
 * @file src/lib/validators/schemas/profiles.schemas.ts
 * @description Aparato de validación atómico y SSoT para la entidad 'profiles'.
 *              Este módulo encapsula el schema de Zod para las preferencias de UI
 *              del usuario, consumiendo el contrato de datos desde la capa de tipos.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
import { z } from "zod";

import { ICON_LIBRARIES_MANIFEST } from "@/config/icon-libraries.config";

/**
 * @public
 * @constant DashboardLayoutPreferencesSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              preferencias de UI del usuario, almacenadas en `profiles.dashboard_layout`.
 *              Este schema es la implementación de validación del contrato de tipo
 *              `DashboardLayoutPreferences`.
 */
export const DashboardLayoutPreferencesSchema = z.object({
  /**
   * @property isSidebarCollapsed
   * @description Indica si la barra lateral (sidebar) secundaria del dashboard está colapsada.
   * @default false
   */
  isSidebarCollapsed: z.boolean().default(false),
  /**
   * @property activeIconLibraryId
   * @description El ID de la librería de iconos activa seleccionada por el usuario.
   *              Se valida dinámicamente contra el manifiesto de librerías de iconos.
   * @default "lucide"
   */
  activeIconLibraryId: z
    .enum(ICON_LIBRARIES_MANIFEST.map((lib) => lib.id) as [string, ...string[]])
    .default("lucide"),
});
// src/lib/validators/schemas/profiles.schemas.ts
