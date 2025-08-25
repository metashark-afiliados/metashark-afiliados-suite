// src/lib/validators/i18n/SettingsPanel.schema.ts
/**
 * @file SettingsPanel.schema.ts
 * @description Define el contrato de datos para el namespace 'components.builder.SettingsPanel'.
 *              Sincronizado para validar la estructura anidada de 'properties',
 *              garantizando la integridad del contrato de i18n para el editor.
 * @author L.I.A. Legacy
 * @version 3.0.0
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
  tabs: z.object({
    content: z.string(),
    style: z.string(),
  }),
  properties: z.object({
    logoText_label: z.string(),
    ctaText_label: z.string(),
    title_label: z.string(),
    subtitle_label: z.string(),
    features_label: z.string(),
    icon_label: z.string(),
    description_label: z.string(),
    backgroundColor_label: z.string(),
    textColor_label: z.string(),
    paddingTop_label: z.string(),
    paddingBottom_label: z.string(),
    // --- INICIO DE SINCRONIZACIÓN ---
    item_label: z.string(),
    removeItem_button: z.string(),
    addItem_button: z.string(),
    // --- FIN DE SINCRONIZACIÓN ---
  }),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Integridad de Contrato i18n Completa**: ((Implementada)) El schema Zod ahora valida la nueva estructura anidada `properties`, incluyendo las claves para la UI del editor de arrays. Esto resuelve la brecha de internacionalización y previene errores de validación.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Dinámica desde `blockEditorDefinitions`**: ((Vigente)) Para una SSoT de élite, un script podría leer el manifiesto `blockEditorDefinitions`, extraer todas las claves de `label` y `placeholder`, y generar este schema Zod automáticamente.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/SettingsPanel.schema.ts
