// src/lib/validators/i18n/LandingPage.schema.ts
/**
 * @file LandingPage.schema.ts
 * @description Aparato de validación y SSoT. Ensambla por composición los schemas
 *              atómicos de cada sección de la Landing Page en un único contrato maestro.
 *              Esta es la culminación de la arquitectura de atomización de i18n.
 * @author L.I.A Legacy
 * @version 2.0.0
 */
import { z } from "zod";

import { BottomCTASchema } from "./BottomCTA.schema";
import { FAQSchema } from "./FAQ.schema";
import { FeaturesSchema } from "./Features.schema";
import { LandingFooterSchema } from "./LandingFooter.schema";
import { LandingHeaderSchema } from "./LandingHeader.schema";
import { HeroSchema } from "./Hero.schema";
import { MetricsSchema } from "./Metrics.schema";
import { ProcessStepsSchema } from "./ProcessSteps.schema";
import { SocialProofSchema } from "./SocialProof.schema";
import { SupportCTASchema } from "./SupportCTA.schema";
import { TestimonialsSchema } from "./Testimonials.schema";

/**
 * @public
 * @constant LandingPageSchema
 * @description El schema Zod maestro que valida la estructura completa del
 *              archivo de mensajes `landing.json` al componer los schemas atómicos.
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
