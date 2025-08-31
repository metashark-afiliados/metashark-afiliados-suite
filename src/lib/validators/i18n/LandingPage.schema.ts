// src/lib/validators/i18n/LandingPage.schema.ts
/**
 * @file LandingPage.schema.ts
 * @description Aparato de validación y SSoT. Ensambla los schemas de i18n atómicos
 *              para crear el contrato de datos consolidado de la Landing Page.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
import { z } from "zod";

import { BottomCTASchema } from "./BottomCTA.schema";
import { FAQSchema } from "./FAQ.schema";
import { FeaturesSchema } from "./Features.schema";
import { HeroSchema } from "./Hero.schema";
import { LandingFooterSchema } from "./LandingFooter.schema";
import { LandingHeaderSchema } from "./LandingHeader.schema";
import { MetricsSchema } from "./Metrics.schema";
import { ProcessStepsSchema } from "./ProcessSteps.schema";
import { SocialProofSchema } from "./SocialProof.schema";
import { SupportCTASchema } from "./SupportCTA.schema";
import { TestimonialsSchema } from "./Testimonials.schema";

/**
 * @public
 * @constant LandingPageSchema
 * @description El schema Zod ensamblado que representa la estructura completa
 *              de todos los mensajes de internacionalización para la HomePage.
 */
export const LandingPageSchema = z.object({
  Header: LandingHeaderSchema,
  Hero: HeroSchema,
  SocialProof: SocialProofSchema,
  Features: FeaturesSchema,
  ProcessSteps: ProcessStepsSchema,
  Testimonials: TestimonialsSchema,
  Metrics: MetricsSchema,
  FAQ: FAQSchema,
  SupportCTA: SupportCTASchema,
  BottomCTA: BottomCTASchema,
  Footer: LandingFooterSchema,
});
// src/lib/validators/i18n/LandingPage.schema.ts
