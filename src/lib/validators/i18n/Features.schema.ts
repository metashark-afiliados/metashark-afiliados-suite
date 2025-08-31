// src/lib/validators/i18n/Features.schema.ts
/**
 * @file Features.schema.ts
 * @description Define el contrato de datos para el namespace 'Features' dentro de `landing.json`.
 *              Ha sido refactorizado para eliminar la dependencia de compilación con el
 *              archivo generado `lucide-icon-names.ts`, mejorando la robustez del build.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
import { z } from "zod";

export const FeaturesSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  features: z.array(
    z.object({
      icon: z.string().min(1), // Validar que es un string, no el enum completo.
      title: z.string(),
      description: z.string(),
    })
  ),
});
// src/lib/validators/i18n/Features.schema.ts
