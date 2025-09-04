// src/lib/validators/i18n/Features.schema.ts
/**
 * @file Features.schema.ts
 * @description Define el contrato de datos para el namespace 'Features' dentro de `landing.json`.
 *              Este aparato atómico de validación ha restaurado la seguridad de
 *              tipos de élite al validar `icon` contra `LucideIconNameSchema`.
 * @author L.I.A Legacy
 * @version 2.0.0
 */
import { z } from "zod";

import { LucideIconNameSchema } from "@/config/lucide-icon-names";

/**
 * @private
 * @constant FeatureSchema
 * @description Define la estructura para una única tarjeta de característica.
 */
const FeatureSchema = z.object({
  icon: LucideIconNameSchema,
  title: z.string(),
  description: z.string(),
});

/**
 * @public
 * @constant FeaturesSchema
 * @description Valida la estructura de la sección de características.
 */
export const FeaturesSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  features: z.record(FeatureSchema),
});
// src/lib/validators/i18n/Features.schema.ts
