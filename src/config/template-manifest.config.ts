// src/config/template-manifest.config.ts
/**
 * @file template-manifest.config.ts
 * @description Manifiesto Declarativo y SSoT para las plantillas de bloques visuales.
 *              Este aparato mapea cada categoría de bloque a un array de plantillas
 *              específicas que se mostrarán en el `TemplateGalleryModal`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type BlockCategoryId } from "./block-categories.config";

export interface TemplateDefinition {
  id: string;
  blockType: string;
  i18nKey: string;
  previewImageUrl: string;
  initialProps?: Record<string, unknown>;
}

export const TEMPLATE_MANIFEST: Record<BlockCategoryId, TemplateDefinition[]> =
  {
    templates: [], // Futuro: Plantillas de página completa
    headers: [
      {
        id: "header-corporate-dark",
        blockType: "Header1",
        i18nKey: "template_header_corporate_dark",
        previewImageUrl: "/images/templates/previews/header1-dark.png",
      },
      {
        id: "header-minimal-light",
        blockType: "Header1",
        i18nKey: "template_header_minimal_light",
        previewImageUrl: "/images/templates/previews/header1-light.png",
      },
      {
        id: "header-bold-cta",
        blockType: "Header1",
        i18nKey: "template_header_bold_cta",
        previewImageUrl: "/images/templates/previews/header1-cta.png",
      },
    ],
    heros: [
      {
        id: "hero-primary-centered",
        blockType: "Hero1",
        i18nKey: "template_hero_primary_centered",
        previewImageUrl: "/images/templates/previews/hero1-centered.png",
      },
      {
        id: "hero-image-left",
        blockType: "Hero1",
        i18nKey: "template_hero_image_left",
        previewImageUrl: "/images/templates/previews/hero1-image-left.png",
      },
      {
        id: "hero-form-right",
        blockType: "Hero1",
        i18nKey: "template_hero_form_right",
        previewImageUrl: "/images/templates/previews/hero1-form-right.png",
      },
    ],
    features: [
      {
        id: "features-3-col-icons",
        blockType: "Features1",
        i18nKey: "template_features_3_col_icons",
        previewImageUrl: "/images/templates/previews/features1-3col.png",
      },
      {
        id: "features-checklist",
        blockType: "Features1",
        i18nKey: "template_features_checklist",
        previewImageUrl: "/images/templates/previews/features1-checklist.png",
      },
      {
        id: "features-alternating-image",
        blockType: "Features1",
        i18nKey: "template_features_alternating_image",
        previewImageUrl: "/images/templates/previews/features1-alternating.png",
      },
    ],
    testimonials: [],
    footers: [],
  };
// src/config/template-manifest.config.ts
