// src/lib/validators/i18n/BuilderHeader.schema.ts
/**
 * @file BuilderHeader.schema.ts
 * @description Define el contrato de datos para el namespace 'components.builder.BuilderHeader'.
 *              Este aparato atómico de validación garantiza la seguridad de tipos
 *              para la cabecera del constructor.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const BuilderHeaderSchema = z.object({
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
// src/lib/validators/i18n/BuilderHeader.schema.ts
