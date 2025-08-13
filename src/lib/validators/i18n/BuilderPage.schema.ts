// src/lib/validators/i18n/BuilderPage.schema.ts
/**
 * @file BuilderPage.schema.ts
 * @description Define el contrato de datos para el namespace 'BuilderPage'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const BuilderPageSchema = z.object({
  Header: z.object({
    back_to_dashboard: z.string(),
    back_to_dashboard_aria: z.string(),
    preview_button: z.string(),
    preview_aria: z.string(),
    History: z.object({
      undo_tooltip: z.string(),
      undo_aria: z.string(),
      redo_tooltip: z.string(),
      redo_aria: z.string(),
    }),
    DevicePreview: z.object({
      desktop_tooltip: z.string(),
      tablet_tooltip: z.string(),
      mobile_tooltip: z.string(),
    }),
    SaveButton: z.object({
      save_changes: z.string(),
      save_aria: z.string(),
      saving: z.string(),
      saved: z.string(),
      save_success: z.string(),
      save_error_no_config: z.string(),
      save_error_default: z.string(),
    }),
  }),
  Palette: z.object({
    title: z.string(),
    unknown_block_preview: z.string(),
    block_name_Header1: z.string(),
    block_name_Hero1: z.string(),
  }),
  SettingsPanel: z.object({
    editing_block_title: z.string(),
    empty_panel: z.object({ title: z.string(), description: z.string() }),
    no_settings_for_block: z.object({
      title: z.string(),
      description: z.string(),
    }),
    unsupported_property_type: z.string(),
    tabs: z.object({ content: z.string(), style: z.string() }),
    properties: z.object({
      logoText: z.string(),
      ctaText: z.string(),
      title: z.string(),
      subtitle: z.string(),
      backgroundColor: z.string(),
      textColor: z.string(),
      paddingTop: z.string(),
      paddingBottom: z.string(),
      marginTop: z.string(),
      marginBottom: z.string(),
    }),
  }),
  Canvas: z.object({
    loading_config: z.string(),
    empty_canvas: z.object({ title: z.string(), description: z.string() }),
    unknown_block_error: z.string(),
  }),
  BlockActions: z.object({
    block_aria_label: z.string(),
    drag_handle_aria: z.string(),
    options_menu_aria: z.string(),
    move_up: z.string(),
    move_down: z.string(),
    duplicate: z.string(),
    delete: z.string(),
  }),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/BuilderPage.schema.ts
