// src/lib/validators/i18n/SettingsPanel.schema.ts
/**
 * @file SettingsPanel.schema.ts
 * @description Define el contrato de datos para el namespace 'components.builder.SettingsPanel'.
 *              Este aparato atómico de validación garantiza la seguridad de tipos
 *              para el panel de ajustes del constructor.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const SettingsPanelSchema = z.object({
  editing_block_title: z.string(),
  empty_panel: z.object({
    title: z.string(),
    description: z.string(),
  }),
  no_settings_for_block: z.object({
    title: z.string(),
    description: z.string(),
  }),
  unsupported_property_type: z.string(),
  tabs: z.object({
    content: z.string(),
    style: z.string(),
  }),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Restauración de Integridad**: ((Implementada)) La creación de este schema resuelve otra dependencia crítica para la infraestructura de i18n.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/SettingsPanel.schema.ts
