// src/lib/validators/i18n/SettingsPanel.schema.ts
/**
 * @file SettingsPanel.schema.ts
 * @description Define el contrato de datos para el namespace 'components.builder.SettingsPanel'.
 *              Sincronizado para incluir todas las claves del "Arsenal de Conversión".
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
import { z } from "zod";

export const SettingsPanelSchema = z.object({
  editing_block_title: z.string(),
  empty_panel: z.object({ title: z.string(), description: z.string() }),
  no_settings_for_block: z.object({
    title: z.string(),
    description: z.string(),
  }),
  tabs: z.object({ content: z.string(), style: z.string() }),
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
    item_label: z.string(),
    removeItem_button: z.string(),
    addItem_button: z.string(),
    testimonials_label: z.string(),
    authorImage_label: z.string(),
    quote_label: z.string(),
    authorName_label: z.string(),
    authorTitle_label: z.string(),
    brandName_label: z.string(),
    slogan_label: z.string(),
    newsletterTitle_label: z.string(),
    newsletterPlaceholder_label: z.string(),
    newsletterButtonText_label: z.string(),
    copyrightText_label: z.string(),
    productLinks_label: z.string(),
    companyLinks_label: z.string(),
    legalLinks_label: z.string(),
    linkText_label: z.string(),
    linkHref_label: z.string(),
  }),
});
// src/lib/validators/i18n/SettingsPanel.schema.ts
