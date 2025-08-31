// src/lib/validators/i18n/LandingPage.schema.ts
/**
 * @file LandingPage.schema.ts
 * @description Aparato de validación y SSoT. Define el contrato de datos maestro y
 *              consolidado para la Landing Page. Esta versión internaliza todos los
 *              sub-schemas para eliminar dependencias externas y resolver el error
 *              de "Module not found".
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
import { z } from "zod";

import { LucideIconNameSchema } from "@/config/lucide-icon-names";

const LinkSchema = z.object({
  label: z.string(),
  href: z.any(),
});

const HeaderSchema = z.object({
  navLinks: z.array(LinkSchema),
  signIn: z.string(),
  signUp: z.string(),
  openMenu: z.string(),
});

const HeroSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  ctaPrimary: z.string(),
  ctaSecondary: z.string(),
});

const SocialProofSchema = z.object({
  title: z.string(),
  logos: z.array(
    z.object({
      name: z.string(),
      src: z.string().url(),
    })
  ),
});

const FeaturesSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  features: z.array(
    z.object({
      icon: LucideIconNameSchema,
      title: z.string(),
      description: z.string(),
    })
  ),
});

const ProcessStepsSchema = z.object({
  tag: z.string(),
  title: z.string(),
  description: z.string(),
  steps: z.array(
    z.object({
      stepNumber: z.string(),
      iconName: LucideIconNameSchema,
      title: z.string(),
      description: z.string(),
      checklist: z.array(z.string()),
    })
  ),
});

const TestimonialsSchema = z.object({
  tag: z.string(),
  title: z.string(),
  subtitle: z.string(),
  testimonials: z.array(
    z.object({
      quote: z.string(),
      authorName: z.string(),
      authorTitle: z.string(),
      authorImage: z.string(),
    })
  ),
});

const MetricsSchema = z.object({
  metrics: z.array(
    z.object({
      iconName: LucideIconNameSchema,
      prefix: z.string().optional(),
      value: z.number(),
      suffix: z.string(),
      label: z.string(),
    })
  ),
});

const FAQSchema = z.object({
  tag: z.string(),
  title: z.string(),
  subtitle: z.string(),
  items: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
  searchPlaceholder: z.string(),
  noResultsText: z.string(),
  clearSearchAriaLabel: z.string(),
});

const SupportCTASchema = z.object({
  title: z.string(),
  description: z.string(),
  contactButtonText: z.string(),
  docsButtonText: z.string(),
});

const BottomCTASchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  featuresTitle: z.string(),
  features: z.array(z.string()),
  ctaPrimaryText: z.string(),
  ctaPlaceholderText: z.string(),
  pricingNote: z.string(),
  guaranteeNote: z.string(),
  creditCardNote: z.string(),
});

const FooterSchema = z.object({
  brand_name: z.string(),
  logo_alt_text: z.string(),
  slogan: z.string(),
  product: z.string(),
  company: z.string(),
  stayUpdated: z.string(),
  newsletterPrompt: z.string(),
  subscribe: z.string(),
  placeholder_email: z.string(),
  allRightsReserved: z.string(),
  productLinks: z.record(z.string()),
  companyLinks: z.record(z.string()),
  legalLinks: z.record(z.string()),
});

export const LandingPageSchema = z.object({
  Header: HeaderSchema,
  Hero: HeroSchema,
  SocialProof: SocialProofSchema,
  Features: FeaturesSchema,
  ProcessSteps: ProcessStepsSchema,
  Testimonials: TestimonialsSchema,
  Metrics: MetricsSchema,
  FAQ: FAQSchema,
  SupportCTA: SupportCTASchema,
  BottomCTA: BottomCTASchema,
  Footer: FooterSchema,
});
// src/lib/validators/i18n/LandingPage.schema.ts
