// src/lib/validators/i18n/LiaChatWidget.schema.ts
/**
 * @file LiaChatWidget.schema.ts
 * @description Define el contrato de datos para el namespace 'LiaChatWidget'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const LiaChatWidgetSchema = z.object({
  aria_label: z.string(),
  coming_soon_toast: z.string(),
  interface_title: z.string(),
  interface_subtitle: z.string(),
  welcome_message: z.string(),
  input_placeholder: z.string(),
  send_button_aria_label: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/LiaChatWidget.schema.ts
