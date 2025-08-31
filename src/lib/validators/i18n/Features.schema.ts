// src/lib/validators/i18n/Features.schema.ts
/**
 * @file Features.schema.ts
 * @description Define el contrato de datos para el namespace 'Features' dentro de `landing.json`.
 *              Este aparato atómico de validación garantiza la seguridad de tipos para la
 *              sección de características de la landing page, incluyendo la validación
 *              de los nombres de iconos contra la SSoT de `lucide-react`.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
import { z } from "zod";

import { LucideIconNameSchema } from "@/config/lucide-icon-names";

export const FeaturesSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  features: z.array(
    z.object({
      icon: LucideIconNameSchema.describe(
        "Nombre del icono de lucide-react, validado."
      ),
      title: z.string(),
      description: z.string(),
    })
  ),
});
// src/lib/validators/i18n/Features.schema.ts
