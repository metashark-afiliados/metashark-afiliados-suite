// src/lib/validators/i18n/TemplateGallery.schema.ts
/**
 * @file TemplateGallery.schema.ts
 * @description Define el contrato de datos para el namespace 'pages.TemplateGallery'.
 *              Este aparato atómico de validación garantiza la seguridad de tipos
 *              para la internacionalización del modal de la galería de plantillas.
 * @author L.I.A. Legacy
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const TemplateGallerySchema = z.object({
  category_templates_title: z.string(),
  category_headers_title: z.string(),
  category_heros_title: z.string(),
  category_features_title: z.string(),
  category_testimonials_title: z.string(),
  category_footers_title: z.string(),
  no_templates_placeholder: z.string(),
  template_header_corporate_dark: z.string(),
  template_header_minimal_light: z.string(),
  template_header_bold_cta: z.string(),
  template_hero_primary_centered: z.string(),
  template_hero_image_left: z.string(),
  template_hero_form_right: z.string(),
  template_features_3_col_icons: z.string(),
  template_features_checklist: z.string(),
  template_features_alternating_image: z.string(),
  template_card_aria_label: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de UI Atómico**: ((Implementada)) Este nuevo schema crea un contrato de datos robusto y explícito para el `TemplateGalleryModal`, asegurando su completa internacionalización y la integridad del sistema de i18n.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Dinámica de Claves**: ((Vigente)) Las claves `template_*` están codificadas. Un sistema de élite podría generar estas claves dinámicamente a partir del `TEMPLATE_MANIFEST` para garantizar que siempre estén sincronizadas.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/TemplateGallery.schema.ts
