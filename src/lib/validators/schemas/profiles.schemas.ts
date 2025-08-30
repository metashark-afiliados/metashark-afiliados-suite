// src/lib/validators/schemas/profiles.schemas.ts
/**
 * @file src/lib/validators/schemas/profiles.schemas.ts
 * @description Aparato de validación atómico y SSoT para la entidad 'profiles'.
 *              Este módulo encapsula el schema de Zod para las preferencias de UI
 *              del usuario, un contrato de datos crítico para la personalización
 *              persistente del dashboard.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";
import { ICON_LIBRARIES_MANIFEST } from "@/config/icon-libraries.config";

/**
 * @public
 * @constant DashboardLayoutPreferencesSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              preferencias de UI del usuario, almacenadas en `profiles.dashboard_layout`.
 *              Este schema es crucial para la personalización de la interfaz.
 */
export const DashboardLayoutPreferencesSchema = z.object({
  /**
   * Indica si la barra lateral (sidebar) secundaria del dashboard está colapsada.
   * @default false
   */
  isSidebarCollapsed: z.boolean().default(false),
  /**
   * El ID de la librería de iconos activa seleccionada por el usuario.
   * Se valida contra el manifiesto de librerías de iconos para máxima seguridad.
   * @default "lucide"
   */
  activeIconLibraryId: z
    .enum(ICON_LIBRARIES_MANIFEST.map((lib) => lib.id) as [string, ...string[]])
    .default("lucide"),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **`UpdateProfileSchema`**: Crear un `UpdateProfileSchema` que valide los datos para actualizar el perfil del usuario (ej. `full_name`, `avatar_url`), reutilizando `NameSchema` y añadiendo `z.string().url().optional()` para el avatar.
 * 2. **Preferencia de `viewMode`**: Extender `DashboardLayoutPreferencesSchema` para incluir una propiedad `sitesViewMode: z.enum(['grid', 'list']).default('grid')`, permitiendo persistir la preferencia de vista de la página "Mis Sitios" en la base de datos.
 * 3. **Preferencia de Tema**: Añadir `theme: z.enum(['light', 'dark', 'system']).default('system')` al schema de preferencias para sincronizar el tema de la UI del usuario a través de diferentes dispositivos.
 * 4. **Orden de Módulos del `ActionDock`**: Incluir `actionDockModuleOrder: z.array(z.string()).optional()` para permitir a los usuarios personalizar el orden de los iconos en el "Hub Creativo".
 * 5. **`OnboardingStatusSchema`**: Crear un schema específico para validar el estado del onboarding (`has_completed_onboarding: z.boolean()`) que podría ser usado en futuras Server Actions relacionadas con el reseteo del tour guiado.
 * =====================================================================
 */
// src/lib/validators/schemas/profiles.schemas.ts
