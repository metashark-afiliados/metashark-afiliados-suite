// src/lib/validators/i18n/Metrics.schema.ts
/**
 * @file Metrics.schema.ts
 * @description Define el contrato de datos atómico para el namespace 'Metrics'
 *              dentro de `landing.json`. Valida la estructura del array de
 *              objetos de métricas, garantizando la integridad de los datos para
 *              el componente `AnimatedCounter`.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
import { z } from "zod";

import { LucideIconNameSchema } from "@/config/lucide-icon-names";

export const MetricsSchema = z.object({
  /** Array de objetos, donde cada objeto representa una métrica individual. */
  metrics: z.array(
    z.object({
      iconName: LucideIconNameSchema.describe(
        "Nombre del icono de lucide-react."
      ),
      prefix: z
        .string()
        .optional()
        .describe("Prefijo opcional para el valor (ej. '+')."),
      value: z.number().describe("El valor numérico de la métrica."),
      suffix: z.string().describe("Sufijo para el valor (ej. '%', '+')."),
      label: z.string().describe("La descripción de la métrica."),
    })
  ),
});
// src/lib/validators/i18n/Metrics.schema.ts
