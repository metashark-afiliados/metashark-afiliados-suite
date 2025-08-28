// src/lib/validators/i18n/LiaChatWidget.schema.ts
/**
 * @file LiaChatWidget.schema.ts
 * @description Define el contrato de datos para el namespace 'LiaChatWidget'.
 *              Ha sido refactorizado holísticamente para incluir todas las nuevas
 *              claves de i18n requeridas por la interfaz de chat de L.I.A.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const LiaChatWidgetSchema = z.object({
  aria_label: z.string(),
  // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Nuevas claves de chat ---
  interface_title: z.string(),
  interface_subtitle: z.string(),
  welcome_message: z.string(),
  input_placeholder: z.string(),
  send_button_aria_label: z.string(),
  thinking_message: z.string(),
  error_api_message: z.string(),
  error_internal_message: z.string(),
  message_user_role: z.string(),
  message_assistant_role: z.string(),
  // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización Completa de Contrato**: ((Implementada)) Se han añadido todas las nuevas claves de i18n (`interface_title`, `welcome_message`, `thinking_message`, etc.) al esquema. Esto asegura que el contrato de datos de i18n esté completo y alineado con los requerimientos del componente `LiaChatInterface.tsx`.
 * 2. **Remoción de Claves Obsoletas**: ((Implementada)) Se ha eliminado la clave `coming_soon_toast` del esquema, reflejando la eliminación del archivo JSON correspondiente.
 * 3. **Integridad Holística**: ((Implementada)) Este cambio completa la alineación del esquema de i18n para la nueva funcionalidad de chat de L.I.A.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Placeholders**: ((Vigente)) Para una validación de élite, las claves que esperan interpolación (ej. `message_user_role`) podrían usar un `.refine()` de Zod para asegurar la presencia de los placeholders.
 * 2. **Separación de Roles**: ((Vigente)) Los roles (`user_role`, `assistant_role`) podrían ser movidos a un esquema `shared.Roles` para su reutilización.
 *
 * =====================================================================
 */
