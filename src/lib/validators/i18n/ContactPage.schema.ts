// src/lib/validators/i18n/ContactPage.schema.ts
/**
 * @file ContactPage.schema.ts
 * @description Define el contrato de datos para el namespace 'ContactPage'.
 *              Sincronizado holísticamente para reflejar la estructura completa y anidada del contenido
 *              del archivo `messages/pages/ContactPage.json`, resolviendo una brecha crítica de sincronización.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const ContactPageSchema = z.object({
  hero: z.object({
    title: z.string().min(1, "title_required"),
    subtitle: z.string().min(1, "subtitle_required"),
  }),
  form: z.object({
    title: z.string().min(1, "form_title_required"),
    nameLabel: z.string().min(1, "nameLabel_required"),
    emailLabel: z.string().min(1, "emailLabel_required"),
    inquiryLabel: z.string().min(1, "inquiryLabel_required"),
    inquiryOptions: z.object({
      sales: z.string().min(1, "inquiry_sales_required"),
      support: z.string().min(1, "inquiry_support_required"),
      general: z.string().min(1, "inquiry_general_required"),
    }),
    messageLabel: z.string().min(1, "messageLabel_required"),
    submitButton: z.string().min(1, "submitButton_required"),
    sendingButton: z.string().min(1, "sendingButton_required"),
  }),
  contactInfo: z.object({
    title: z.string().min(1, "contactInfo_title_required"),
    cards: z
      .array(
        z.object({
          icon: z.string().min(1, "icon_required"),
          title: z.string().min(1, "card_title_required"),
          description: z.string().min(1, "card_description_required"),
          value: z.string().min(1, "card_value_required"),
          href: z.string().url().optional().or(z.string().optional()), // Permite URL o string vacío
        })
      )
      .min(1, "contactInfo_cards_required"),
  }),
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
 * 1. **Sincronización Completa de Contrato**: ((Implementada)) El schema ha sido actualizado para reflejar la estructura completa y anidada del archivo `messages/pages/ContactPage.json`, incluyendo `hero`, `form`, `contactInfo` y sus subpropiedades. Esto resuelve la brecha crítica de sincronización y asegura el tipado de todas las claves de traducción.
 * 2. **Robustez de Validación**: ((Implementada)) Se han añadido validaciones `.min(1)` a todas las propiedades de tipo `string` para asegurar que las claves de traducción no estén vacías, y a los arrays (`cards`) para asegurar que haya al menos un elemento. Esto aumenta la robustez del contrato.
 * 3. **Flexibilidad de Enlaces**: ((Implementada)) La propiedad `href` en `cards` se ha definido como `z.string().url().optional().or(z.string().optional())` para permitir URLs válidas o strings vacíos, adaptándose a los diferentes tipos de enlaces (mailto, /docs).
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Iconos**: ((Vigente)) El campo `icon` en `cards` es actualmente un `z.string()`. Podría ser validado contra `LucideIconNameSchema` para asegurar que solo se usan iconos válidos de Lucide.
 * 2. **Consolidación de `inquiryOptions`**: ((Vigente)) El objeto `inquiryOptions` dentro de `form` es un conjunto de strings. Podría abstraerse a un `z.enum` si las opciones son fijas y se necesita un tipado más estricto para los valores de la opción en el componente de UI.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/ContactPage.schema.ts
